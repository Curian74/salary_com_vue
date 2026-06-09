<script setup lang="ts">
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsInput from '@/components/base/MsInput.vue';
import MsMenuSelect from '@/components/base/MsMenuSelect.vue';
import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
    OptionShowPaycheck,
    SourceType,
    ValueType,
} from '@/enums/salaryCompositionEnums';
import {
    autoSumEmployeeTypeText,
    compositionNatureText,
    compositionTypeText,
    deductionTypeText,
    incomeTaxTypeText,
    optionShowPaycheckText,
    sourceTypeText,
    valueTypeText,
} from '@/constants/salaryCompositionLabels';
import type { GetOrganizationTreeResponse } from '@/types/organization';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SalaryCompositionOrganization from './SalaryCompositionOrganization.vue';
import { useForm } from 'vee-validate';
import type { CreateSalaryCompositionRequest, GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition';
import { salaryCompositionSchema } from '@/validations/salaryCompositionSchema';
import MsIcon from '@/components/base/MsIcon.vue';
import MsTooltip from '@/components/base/MsTooltip.vue';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import type { PagedResult } from '@/types/apiResponse.ts';
import SalaryCompositionSelect from './SalaryCompositionSelect.vue';
import codeHelper from '@/helpers/codeHelper.ts';

type FormMode = 'create' | 'edit' | 'view';
type EnumLike = Record<string, string | number>;
type SelectValue = string | number | null;

interface Props {
    mode: FormMode
    organizationItems?: GetOrganizationTreeResponse[],
}

const props = withDefaults(defineProps<Props>(), {
    organizationItems: () => [],
});

const getEnumNumberValues = (enumObject: EnumLike) =>
    Object.values(enumObject).filter((value): value is number => typeof value === 'number');

const toSelectOptions = <T extends number>(enumObject: EnumLike, labels: Record<T, string>) =>
    getEnumNumberValues(enumObject).map((value) => ({
        value,
        label: labels[value as T],
    }));

const salaryCompositionFormOptions = {
    compositionType: toSelectOptions<CompositionType>(CompositionType, compositionTypeText),
    compositionNature: toSelectOptions<CompositionNature>(CompositionNature, compositionNatureText),
    incomeTaxType: toSelectOptions<IncomeTaxType>(IncomeTaxType, incomeTaxTypeText),
    deductionType: toSelectOptions<DeductionType>(DeductionType, deductionTypeText),
    valueType: toSelectOptions<ValueType>(ValueType, valueTypeText),
    autoSumEmployeeType: toSelectOptions<AutoSumEmployeeType>(
        AutoSumEmployeeType,
        autoSumEmployeeTypeText,
    ),
    optionShowPaycheck: toSelectOptions<OptionShowPaycheck>(
        OptionShowPaycheck,
        optionShowPaycheckText,
    ),
    sourceType: [
        {
            value: SourceType.UserAdded,
            label: sourceTypeText[SourceType.UserAdded],
        },
    ],
};

// #region Organization picker logic
const selectedOrganizationIds = ref<string[]>([]);
const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);

const toggleOrganizationDropdown = () => {
    if (isReadOnly.value) {
        return;
    }

    isOrganizationDropdownOpen.value = !isOrganizationDropdownOpen.value;
};

const closeOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = false;
};

const setOrganizationDropdownElement = (element: HTMLElement | null) => {
    organizationDropdownRef.value = element;
};

const handleOrganizationIdsChange = (organizationIds: string[]) => {
    if (isReadOnly.value) {
        return;
    }

    selectedOrganizationIds.value = organizationIds;
    organizationUnitIds.value = organizationIds;
};

const handleDocumentPointerDown = (event: PointerEvent) => {
    if (!isOrganizationDropdownOpen.value) {
        return;
    }

    const target = event.target as Node | null;

    if (target && organizationDropdownRef.value?.contains(target)) {
        return;
    }

    closeOrganizationDropdown();
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeOrganizationDropdown();
    }
};

const getAllOrganizationIds = (items: GetOrganizationTreeResponse[]): string[] =>
    items.flatMap((organization) => [
        organization.id,
        ...getAllOrganizationIds(organization.children ?? []),
    ]);

const selectAllOrganizations = (items: GetOrganizationTreeResponse[]) => {
    const organizationIds = getAllOrganizationIds(items);

    selectedOrganizationIds.value = organizationIds;
    organizationUnitIds.value = organizationIds;
};

//#endregion

const isReadOnly = computed(() => props.mode === 'view');
const salaryCompositionFormRef = ref<HTMLFormElement | null>(null);
const nameInputRef = ref<InstanceType<typeof MsInput>>();

const emit = defineEmits<{
    submit: [payload: CreateSalaryCompositionRequest]
}>();

const { errors, defineField, handleSubmit, meta } =
    useForm<CreateSalaryCompositionRequest>({
        validationSchema: salaryCompositionSchema,
        validateOnMount: false,
        initialValues: {
            code: '',
            name: '',

            compositionType: undefined,
            compositionNature: CompositionNature.Income,
            incomeTaxType: IncomeTaxType.Taxable,
            deductionType: undefined,

            allowToExceedQuota: false,

            valueType: ValueType.Currency,
            isAutoSumEmployee: false,
            autoSumEmployeeType: AutoSumEmployeeType.SameWorkingUnit,
            organizationalStructureLevel: undefined,
            salaryCompositionId: null,

            optionShowPaycheck: OptionShowPaycheck.Yes,
            organizationUnitIds: [],
        },
    });

const [code] = defineField('code');
const [name] = defineField('name');
const [description] = defineField('description');
const [compositionType] = defineField('compositionType');
const [compositionNature] = defineField('compositionNature');
const [incomeTaxType] = defineField('incomeTaxType');
const [deductionType] = defineField('deductionType');
const [quotaFormula] = defineField('quotaFormula');
const [allowToExceedQuota] = defineField('allowToExceedQuota');
const [valueType] = defineField('valueType');
const [isAutoSumEmployee] = defineField('isAutoSumEmployee');
const [autoSumEmployeeType] = defineField('autoSumEmployeeType');
const [salaryCompositionId] = defineField('salaryCompositionId');
const [optionShowPaycheck] = defineField('optionShowPaycheck');
const [organizationUnitIds] = defineField('organizationUnitIds');

const lastAutoGeneratedCode = ref('');

const canSyncCodeFromName = () => {
    return !code.value || code.value === lastAutoGeneratedCode.value;
};

const handleCodeChange = (value: string) => {
    code.value = value;
};

// Cập nhật code theo name
watch(name, (value) => {
    if (isReadOnly.value || !canSyncCodeFromName()) {
        return;
    }

    const generatedCode = codeHelper.generateCodeFromName(value);

    code.value = generatedCode;
    lastAutoGeneratedCode.value = generatedCode;
});

// Khi tắt tự động cộng tổng thì reset lại các field liên quan
watch(isAutoSumEmployee, (value) => {
    if (!value) {
        salaryCompositionId.value = null;
    }
});

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: 1,
    pageSize: 10,
    searchTerm: '',
});

const salaryCompositions = ref<PagedResult<GetSalaryCompositionsResponse>>({
    items: [],
    totalCount: 0,
    pageSize: queryObject.value.pageSize,
    pageIndex: queryObject.value.pageIndex,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
});

const isSalaryCompositionsLoading = ref(false);

watch(
    () => props.organizationItems,
    (organizationItems) => {
        if (selectedOrganizationIds.value.length > 0 || (organizationUnitIds.value?.length ?? 0) > 0) {
            return;
        }

        selectAllOrganizations(organizationItems);
    },
    { immediate: true },
);

const isShowValueMethodOptions = computed(() => {
    return [
        ValueType.Number,
        ValueType.Currency,
    ].includes(valueType.value as ValueType);
});

const focusFirstInvalidField = async (
    validationErrors: Partial<Record<keyof CreateSalaryCompositionRequest, string | undefined>>,
) => {
    if (isReadOnly.value) {
        return;
    }

    await nextTick();

    // 1. Lấy tất cả các container có gắn attribute data-validation-field theo thứ tự DOM từ trên xuống
    const formFields = salaryCompositionFormRef.value?.querySelectorAll('[data-validation-field]');
    if (!formFields) return;

    // 2. Duyệt qua từng phần tử để tìm trường đầu tiên bị lỗi
    for (const fieldElement of formFields) {
        const fieldName = fieldElement.getAttribute('data-validation-field') as keyof CreateSalaryCompositionRequest;

        // Nếu trường này có trong object errors trả về từ vee-validate
        if (fieldName && validationErrors[fieldName]) {
            // 3. Tìm phần tử có thể focus được bên trong container đó
            const focusableElement = fieldElement.matches('input, select, textarea, button, [tabindex]:not([tabindex="-1"])')
                ? fieldElement
                : fieldElement.querySelector<HTMLElement>('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');

            if (focusableElement) {
                (focusableElement as HTMLElement).focus({ preventScroll: true });
                (focusableElement as HTMLElement).scrollIntoView({ behavior: 'auto', block: 'center' });
                break; // Tìm thấy trường đầu tiên bị lỗi rồi thì dừng vòng lặp ngay
            }
        }
    }
};

const handleCompositionNatureChange = (value: SelectValue) => {
    const nextCompositionNature = value as CompositionNature;

    compositionNature.value = nextCompositionNature;

    if (nextCompositionNature !== CompositionNature.Income) {
        incomeTaxType.value = undefined;
    }

    if (nextCompositionNature !== CompositionNature.Deduction) {
        deductionType.value = undefined;
    }

    if (nextCompositionNature === CompositionNature.Other) {
        allowToExceedQuota.value = undefined;
        quotaFormula.value = undefined;
    }
};

const handleDeductionTypeChange = (value: DeductionType, checked: boolean) => {
    deductionType.value = checked ? value : undefined;
};

const handleAutoSumEmployeeTypeChange = (value: SelectValue) => {
    autoSumEmployeeType.value = value as AutoSumEmployeeType;

    // Bỏ chọn thành phần lương khi không phải tự động cộng tổng
    if (!isAutoSumEmployee.value) {
        salaryCompositionId.value = null;
    }
};

const submitForm = handleSubmit(
    (payload) => {
        emit('submit', payload);
    },
    ({ errors }) => {
        focusFirstInvalidField(errors);
    },
);

async function fetchSalaryCompositions() {
    try {
        isSalaryCompositionsLoading.value = true;
        const salData = await salaryCompositionApi.fetchSalaryCompositions(queryObject.value);
        salaryCompositions.value = salData.value;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        isSalaryCompositionsLoading.value = false;
    }
}

function handleLoadMore() {
    queryObject.value.pageSize *= 2;
}

// Kiểm tra trạng thái dirty
const checkFormDirty = () => {
    return meta.value.dirty;
};

watch(
    () => queryObject.value.pageSize,
    fetchSalaryCompositions,
);

// Đẩy hàm submitForm ra ngoài để component cha có thể gọi khi click nút Lưu
defineExpose({
    submitForm,
    checkFormDirty,
});

onMounted(async () => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);

    await fetchSalaryCompositions();
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});

onMounted(async () => {
    // Chờ dom load xong mới auto focus
    await nextTick();

    if (!isReadOnly.value) {
        nameInputRef.value?.focus();
    }
});

</script>

<template>
    <div class="salary-composition-form-scroll h-full overflow-y-auto px-12 pb-22 pt-5">
        <form ref="salaryCompositionFormRef" class="salary-composition-form" @submit.prevent="submitForm">
            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="composition-name">
                    Tên thành phần <span class="text-error">*</span>
                </label>
                <div class="salary-composition-form__control" data-validation-field="name">
                    <MsInput ref="nameInputRef" v-model="name" id="composition-name"
                        class="salary-composition-form__input"
                        :class="{ 'salary-composition-form__input--invalid': errors.name }" :disabled="isReadOnly" />
                    <span v-if="errors.name" class="text-error text-[13px]">
                        {{ errors.name }}
                    </span>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="composition-code">
                    Mã thành phần <span class="text-error">*</span>
                </label>
                <div class="salary-composition-form__control" data-validation-field="code">
                    <MsInput :model-value="code" id="composition-code" class="salary-composition-form__input"
                        :class="{ 'salary-composition-form__input--invalid': errors.code }" :disabled="isReadOnly"
                        @update:model-value="handleCodeChange" placeholder="Nhập mã viết liền" />
                    <span v-if="errors.code" class="text-error text-[13px]">
                        {{ errors.code }}
                    </span>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label">
                    Đơn vị áp dụng <span class="text-error">*</span>
                </label>

                <div class="salary-composition-form__control" data-validation-field="organizationUnitIds">
                    <SalaryCompositionOrganization class="salary-composition-form__organization"
                        :show-unfollowed-orgs="false" :selected-organization-ids="selectedOrganizationIds"
                        :show-inactive-organizations="false" :organization-items="organizationItems"
                        :is-open="isOrganizationDropdownOpen" :invalid="Boolean(errors.organizationUnitIds)"
                        @update:selected-organization-ids="handleOrganizationIdsChange"
                        @toggle="toggleOrganizationDropdown" @set-dropdown-el="setOrganizationDropdownElement" />

                    <span v-if="errors.organizationUnitIds" class="text-error text-[13px]">
                        {{ errors.organizationUnitIds }}
                    </span>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="composition-type">
                    Loại thành phần <span class="text-error">*</span>
                </label>
                <div class="salary-composition-form__control" data-validation-field="compositionType">
                    <MsMenuSelect id="composition-type" v-model="compositionType" :disabled="isReadOnly"
                        :options="salaryCompositionFormOptions.compositionType" class="salary-composition-form__select
                        salary-composition-form__select--compact" :invalid="Boolean(errors.compositionType)" />
                    <span v-if="errors.compositionType" class="text-error text-[13px]">
                        {{ errors.compositionType }}
                    </span>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="nature">
                    Tính chất <span class="text-error">*</span>
                </label>
                <div class="salary-composition-form__control" data-validation-field="compositionNature">
                    <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
                        <MsMenuSelect id="nature" :model-value="compositionNature" :disabled="isReadOnly"
                            :options="salaryCompositionFormOptions.compositionNature" class="salary-composition-form__select
                            salary-composition-form__select--compact" :invalid="Boolean(errors.compositionNature)"
                            @update:model-value="handleCompositionNatureChange" />

                        <label v-if="compositionNature === CompositionNature.Income"
                            v-for="option in salaryCompositionFormOptions.incomeTaxType" :key="option.value"
                            class="salary-composition-form__radio">
                            <input type="radio" name="tax-status" :value="option.value"
                                :checked="incomeTaxType === option.value" :disabled="isReadOnly"
                                @change="incomeTaxType = option.value" />
                            <span>{{ option.label }}</span>
                        </label>

                        <label v-if="compositionNature === CompositionNature.Deduction"
                            v-for="option in salaryCompositionFormOptions.deductionType" :key="option.value"
                            class="salary-composition-form__radio">
                            <MsCheckbox :checked="deductionType === option.value" :disabled="isReadOnly"
                                @change="checked => handleDeductionTypeChange(option.value, checked)" />
                            <span>{{ option.label }}</span>
                        </label>

                        <span v-if="errors.compositionNature" class="text-error text-[13px]">
                            {{ errors.compositionNature }}
                        </span>
                    </div>
                </div>
            </div>

            <template v-if="compositionNature !== 3">
                <div class="salary-composition-form__row">
                    <label class="salary-composition-form__label" for="quota-description">Định mức</label>
                    <div class="salary-composition-form__control">
                        <textarea id="quota-description" class="salary-composition-form__textarea h-22"
                            :readonly="isReadOnly" v-model="description"></textarea>
                    </div>
                </div>

                <div class="salary-composition-form__row">
                    <span class="salary-composition-form__label" aria-hidden="true"></span>
                    <div class="salary-composition-form__inline-control">
                        <MsCheckbox :checked="allowToExceedQuota" :disabled="isReadOnly"
                            @change="allowToExceedQuota = $event" />
                        <span>Cho phép giá trị tính vượt quá định mức</span>
                        <MsTooltip :show-arrow="true"
                            content='Nếu không tích chọn thì khi tính giá trị của thành phần lương
                             này mà số tiền vượt quá định mức thì chương trình sẽ tự động lấy tối đa bằng định mức đã nhập'>
                            <MsIcon name="info-icon"></MsIcon>
                        </MsTooltip>
                    </div>
                </div>
            </template>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="value-type">Kiểu giá trị</label>
                <div class="salary-composition-form__control" data-validation-field="valueType">
                    <MsMenuSelect id="value-type" v-model="valueType" :disabled="isReadOnly || compositionNature !== 3"
                        :options="salaryCompositionFormOptions.valueType" class="salary-composition-form__select
                        salary-composition-form__select--medium" :invalid="Boolean(errors.valueType)" />
                    <span v-if="errors.valueType" class="text-error text-[13px]">
                        {{ errors.valueType }}
                    </span>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label">Giá trị</label>

                <div class="salary-composition-form__control salary-composition-form__control--stacked">

                    <div v-if="isShowValueMethodOptions" class="salary-composition-form__value-methods">
                        <label class="salary-composition-form__radio">
                            <input type="radio" name="value-method" :checked="isAutoSumEmployee" :disabled="isReadOnly"
                                @change="isAutoSumEmployee = true" />
                            <span>Tự động cộng tổng giá trị của các nhân viên</span>
                        </label>

                        <div class="salary-composition-form__auto-sum-row">
                            <MsMenuSelect :options="salaryCompositionFormOptions.autoSumEmployeeType"
                                :model-value="autoSumEmployeeType ?? null" :disabled="isReadOnly || !isAutoSumEmployee"
                                class="salary-composition-form__select salary-composition-form__select--medium"
                                @update:model-value="handleAutoSumEmployeeTypeChange">

                                <template #right="{ option }">
                                    <MsTooltip :show-arrow="true" content=''>
                                        <MsIcon name="info-icon">{{ option.name }} aaa</MsIcon>
                                    </MsTooltip>
                                </template>

                            </MsMenuSelect>

                            <SalaryCompositionSelect v-if="isAutoSumEmployee" v-model="salaryCompositionId"
                                :data="salaryCompositions.items" :is-loading="isSalaryCompositionsLoading"
                                :has-more="salaryCompositions.hasNextPage" :disabled="isReadOnly || !isAutoSumEmployee"
                                @load-more="handleLoadMore" placeholder="Chọn thành phần lương để hiển thị giá trị"
                                class="salary-composition-form__salary-select" />
                        </div>

                        <label class="salary-composition-form__radio">
                            <input type="radio" name="value-method" :checked="!isAutoSumEmployee" :disabled="isReadOnly"
                                @change="isAutoSumEmployee = false" />
                            <span>Tính theo công thức tự đặt</span>
                        </label>
                    </div>

                    <div v-if="!isAutoSumEmployee" class="salary-composition-form__formula">
                        <textarea class="salary-composition-form__textarea h-22" :readonly="isReadOnly"
                            placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>
                    </div>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="description">Mô tả</label>
                <div class="salary-composition-form__control">
                    <textarea id="description" class="salary-composition-form__textarea h-22"
                        :readonly="isReadOnly"></textarea>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label">Hiển thị trên phiếu lương</label>
                <div class="salary-composition-form__control" data-validation-field="optionShowPaycheck">
                    <div class="flex flex-wrap items-center gap-6">
                        <label v-for="option in salaryCompositionFormOptions.optionShowPaycheck" :key="option.value"
                            class="salary-composition-form__radio">
                            <input type="radio" name="show-on-payroll" :value="option.value"
                                :checked="optionShowPaycheck === option.value" :disabled="isReadOnly"
                                @change="optionShowPaycheck = option.value" />
                            <span>{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="salary-composition-form__row">
                <label class="salary-composition-form__label" for="source">Nguồn tạo</label>
                <div class="salary-composition-form__control">
                    <MsMenuSelect id="source" :model-value="SourceType.UserAdded"
                        :options="salaryCompositionFormOptions.sourceType" disabled class="salary-composition-form__select
                        salary-composition-form__select--medium" />
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.salary-composition-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.salary-composition-form__row {
    display: grid;
    grid-template-columns: 220px minmax(320px, 1048px);
    column-gap: 30px;
    align-items: start;
}

.salary-composition-form__label {
    min-height: 34px;
    display: flex;
    align-items: center;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-form__control {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
}

.salary-composition-form__control--stacked {
    gap: 12px;
}

.salary-composition-form__inline-control {
    display: flex;
    min-height: 34px;
    min-width: 0;
    align-items: center;
    gap: 10px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-form__field,
.salary-composition-form__input,
.salary-composition-form__textarea {
    min-height: 34px;
    border: 1px solid #cfd4da;
    border-radius: 8px;
    background: #ffffff;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.salary-composition-form__field:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.salary-composition-form__input,
.salary-composition-form__textarea {
    width: 80%;
}

.salary-composition-form__input {
    padding: 0 9px;
}

.salary-composition-form__organization {
    width: 80%;
    max-width: none;
}

.salary-composition-form__textarea {
    resize: vertical;
    padding: 8px 12px;
}

.salary-composition-form__input::placeholder,
.salary-composition-form__textarea::placeholder {
    color: #c5cad1;
}

.salary-composition-form__field:hover,
.salary-composition-form__input:hover,
.salary-composition-form__textarea:hover {
    border-color: #aab2bd;
}

.salary-composition-form__field:focus,
.salary-composition-form__input:focus,
.salary-composition-form__textarea:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

.salary-composition-form__input--invalid,
.salary-composition-form__input--invalid:hover,
.salary-composition-form__input--invalid:focus {
    border-color: var(--app-color-error);
}

.salary-composition-form__input--invalid:focus {
    box-shadow: 0 0 0 2px rgba(229, 72, 72, 0.12);
}

.salary-composition-form__select {
    width: 100%;
}

.salary-composition-form__select--medium {
    max-width: 394px;
}

.salary-composition-form__select--compact {
    max-width: 296px;
}

.salary-composition-form__radio {
    display: inline-flex;
    min-height: 20px;
    align-items: center;
    gap: 8px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-form__radio input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--app-color-primary);
}

.salary-composition-form__value-methods {
    display: flex;
    max-width: 1048px;
    flex-direction: column;
    gap: 12px;
}

.salary-composition-form__auto-sum-row {
    display: grid;
    width: 80%;
    grid-template-columns: minmax(220px, 296px) minmax(320px, 1fr);
    gap: 10px;
}

.salary-composition-form__salary-select {
    min-width: 0;
}

.salary-composition-form__formula {
    position: relative;
    max-width: 1048px;
}

.salary-composition-form-scroll {
    scrollbar-gutter: stable;
}

@media (max-width: 900px) {
    .salary-composition-form__row {
        grid-template-columns: 1fr;
        row-gap: 10px;
    }

    .salary-composition-form__label {
        min-height: auto;
        padding-top: 8px;
    }

    .salary-composition-form__input,
    .salary-composition-form__textarea,
    .salary-composition-form__organization {
        width: 100%;
    }

    .salary-composition-form__auto-sum-row {
        grid-template-columns: 1fr;
    }
}
</style>
