<script setup lang="ts">
import organizationApi from '@/apis/organizationApi';
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsInput from '@/components/base/MsInput.vue';
import MsSelect from '@/components/base/MsSelect.vue';
import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    IncomeTaxType,
    OptionShowPaycheck,
    SourceType,
    TrackingStatus,
    ValueType,
} from '@/enums/salaryCompositionEnums';
import {
    autoSumEmployeeTypeText,
    compositionNatureText,
    compositionTypeText,
    incomeTaxTypeText,
    optionShowPaycheckText,
    sourceTypeText,
    valueTypeText,
} from '@/constants/salaryCompositionLabels';
import type { GetOrganizationTreeResponse } from '@/types/organization';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SalaryCompositionOrganization from './SalaryCompositionOrganization.vue';
import { useForm } from 'vee-validate';
import type { CreateSalaryCompositionRequest } from '@/types/salaryComposition';
import { salaryCompositionSchema } from '@/validations/salaryCompositionSchema';

type FormMode = 'create' | 'edit' | 'view';
type EnumLike = Record<string, string | number>;
type SelectValue = string | number | null;

const props = defineProps<{
    mode: FormMode
}>();

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

//#region Organization picker logic
const organizationTreeItems = ref<GetOrganizationTreeResponse[]>([]);
const selectedOrganizationIds = ref<string[]>([]);
const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);
const organizationTrackingStatus = ref<TrackingStatus | undefined>(TrackingStatus.Active);

const isShowInactiveOrganizations = computed(() => organizationTrackingStatus.value === undefined);

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
    setFieldValue('organizationUnitIds', organizationIds);
};

const handleShowAllOrganization = () => {
    organizationTrackingStatus.value =
        organizationTrackingStatus.value === TrackingStatus.Active ? undefined : TrackingStatus.Active;

    fetchOrganizationTree();
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

const fetchOrganizationTree = async () => {
    try {
        const response = await organizationApi.fetchOrganizationTree({
            trackingStatus: organizationTrackingStatus.value,
        });

        organizationTreeItems.value = response.value;
    }
    catch (err) {
        console.log(err);
        organizationTreeItems.value = [];
    }
};

onMounted(async () => {
    await fetchOrganizationTree();

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});
//#endregion

const isReadOnly = computed(() => props.mode === 'view');

const emit = defineEmits<{
    submit: [payload: CreateSalaryCompositionRequest]
}>();

const { values, errors, setFieldValue, handleSubmit, } =
    useForm<CreateSalaryCompositionRequest>({
        validationSchema: salaryCompositionSchema,
        validateOnMount: false,
        initialValues: {
            code: '',
            name: '',
            description: '',
            systemCompositionId: '',

            compositionType: undefined,
            compositionNature: CompositionNature.Income,
            incomeTaxType: IncomeTaxType.Taxable,
            deductionType: undefined,

            quotaFormula: '',
            allowToExceedQuota: false,

            valueType: ValueType.Number,
            isAutoSumEmployee: true,
            autoSumEmployeeType: AutoSumEmployeeType.SameWorkingUnit,
            organizationalStructureLevel: undefined,

            valueFormula: '',
            optionShowPaycheck: OptionShowPaycheck.Yes,

            organizationUnitIds: [],
        },
    });

const handleCompositionTypeChange = (value: SelectValue) => {
    setFieldValue('compositionType', value as CompositionType);
};

const handleCompositionNatureChange = (value: SelectValue) => {
    setFieldValue('compositionNature', value as CompositionNature);
};

const handleValueTypeChange = (value: SelectValue) => {
    setFieldValue('valueType', value as ValueType);
};

const handleAutoSumEmployeeTypeChange = (value: SelectValue) => {
    setFieldValue('autoSumEmployeeType', value as AutoSumEmployeeType);
};

const submitForm = handleSubmit((payload) => {
    emit('submit', payload);
});

onMounted(() => {
    console.log('errors', errors.value);
});

</script>

<template>
    <div class="salary-composition-form-scroll h-full overflow-y-auto px-12 pb-22 pt-5">
        <form class="salary-composition-form" @submit.prevent="submitForm">
            <label class="salary-composition-form__label" for="composition-name">
                Tên thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsInput id="composition-name" class="salary-composition-form__input" :value="values.name"
                    :disabled="isReadOnly" @update:model-value="setFieldValue('name', $event)" />
                <span v-if="errors.name" class="text-error text-[13px]">
                    {{ errors.name }}
                </span>
            </div>

            <label class="salary-composition-form__label" for="composition-code">
                Mã thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsInput id="composition-code" class="salary-composition-form__input" :disabled="isReadOnly"
                    placeholder="Nhập mã viết liền" />
                <span v-if="errors.code" class="text-error text-[13px]">
                    {{ errors.code }}
                </span>
            </div>

            <label class="salary-composition-form__label">
                Đơn vị áp dụng <span class="text-error">*</span>
            </label>

            <div>
                <SalaryCompositionOrganization :selected-organization-ids="selectedOrganizationIds"
                    :show-inactive-organizations="isShowInactiveOrganizations"
                    :organization-items="organizationTreeItems" :is-open="isOrganizationDropdownOpen"
                    @update:selected-organization-ids="handleOrganizationIdsChange"
                    @update:show-inactive-organizations="handleShowAllOrganization" @toggle="toggleOrganizationDropdown"
                    @set-dropdown-el="setOrganizationDropdownElement" />

                <span v-if="errors.organizationUnitIds" class="text-error text-[13px]">
                    {{ errors.organizationUnitIds }}
                </span>
            </div>

            <label class="salary-composition-form__label" for="composition-type">
                Loại thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsSelect id="composition-type" :model-value="values.compositionType ?? null" :disabled="isReadOnly"
                    :options="salaryCompositionFormOptions.compositionType" class="salary-composition-form__select
                    salary-composition-form__select--medium" @update:model-value="handleCompositionTypeChange" />
                <span v-if="errors.compositionType" class="text-error text-[13px]">
                    {{ errors.compositionType }}
                </span>
            </div>

            <label class="salary-composition-form__label" for="nature">
                Tính chất <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
                    <MsSelect id="nature" :model-value="values.compositionNature" :disabled="isReadOnly"
                        :options="salaryCompositionFormOptions.compositionNature" class="salary-composition-form__select
                        salary-composition-form__select--medium" @update:model-value="handleCompositionNatureChange" />

                    <label v-for="option in salaryCompositionFormOptions.incomeTaxType" :key="option.value"
                        class="salary-composition-form__radio">
                        <input type="radio" name="tax-status" :value="option.value"
                            :checked="values.incomeTaxType === option.value" :disabled="isReadOnly"
                            @change="setFieldValue('incomeTaxType', option.value)" />
                        <span>{{ option.label }}</span>
                    </label>

                    <span v-if="errors.compositionNature" class="text-error text-[13px]">
                        {{ errors.compositionNature }}
                    </span>
                </div>
            </div>

            <label class="salary-composition-form__label" for="limit">Định mức</label>
            <textarea id="description" class="salary-composition-form__textarea h-22" :readonly="isReadOnly"
                :value="values.description"
                @input="setFieldValue('description', ($event.target as HTMLTextAreaElement).value)"></textarea>

            <div></div>
            <div class="flex h-7 items-center gap-2.5 text-[13px] text-[#001b44]">
                <MsCheckbox :checked="values.allowToExceedQuota" :disabled="isReadOnly"
                    @change="setFieldValue('allowToExceedQuota', $event)" />
                <span>Cho phép giá trị tính vượt quá định mức</span>
                <span class="inline-flex size-5 items-center justify-center rounded-full border border-[#7d8591]
                         text-[13px] font-bold text-[#6b7280]">i</span>
            </div>

            <label class="salary-composition-form__label" for="value-type">Kiểu giá trị</label>
            <div class="salary-composition-form__control">
                <MsSelect id="value-type" :model-value="values.valueType" :disabled="isReadOnly"
                    :options="salaryCompositionFormOptions.valueType" class="salary-composition-form__select
                    salary-composition-form__select--medium" @update:model-value="handleValueTypeChange" />
            </div>

            <label class="salary-composition-form__label">Giá trị</label>
            <div class="flex flex-col gap-3">
                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method" :checked="values.isAutoSumEmployee" :disabled="isReadOnly"
                        @change="setFieldValue('isAutoSumEmployee', true)" />
                    <span>Tự động cộng tổng giá trị của các nhân viên</span>
                </label>

                <MsSelect :model-value="values.autoSumEmployeeType ?? null" :disabled="isReadOnly"
                    :options="salaryCompositionFormOptions.autoSumEmployeeType" class="salary-composition-form__select
                    salary-composition-form__select--medium" @update:model-value="handleAutoSumEmployeeTypeChange" />

                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method" :checked="!values.isAutoSumEmployee" :disabled="isReadOnly"
                        @change="setFieldValue('isAutoSumEmployee', false)" />
                    <span>Tính theo công thức tự đặt</span>
                </label>

                <div class="relative max-w-262">
                    <textarea class="salary-composition-form__textarea h-22" :readonly="isReadOnly"
                        placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>
                </div>
            </div>

            <label class="salary-composition-form__label" for="description">Mô tả</label>
            <textarea id="description" class="salary-composition-form__textarea h-22" :readonly="isReadOnly"></textarea>

            <label class="salary-composition-form__label">Hiển thị trên phiếu lương</label>
            <div class="salary-composition-form__control">
                <div class="flex flex-wrap items-center gap-6">
                    <label v-for="option in salaryCompositionFormOptions.optionShowPaycheck" :key="option.value"
                        class="salary-composition-form__radio">
                        <input type="radio" name="show-on-payroll" :value="option.value"
                            :checked="values.optionShowPaycheck === option.value" :disabled="isReadOnly"
                            @change="setFieldValue('optionShowPaycheck', option.value)" />
                        <span>{{ option.label }}</span>
                    </label>
                </div>
            </div>

            <label class="salary-composition-form__label" for="source">Nguồn tạo</label>
            <MsSelect id="source" :model-value="SourceType.UserAdded" :options="salaryCompositionFormOptions.sourceType"
                disabled class="salary-composition-form__select
                salary-composition-form__select--medium" />
        </form>
    </div>
</template>

<style scoped>
.salary-composition-form {
    display: grid;
    grid-template-columns: 220px minmax(320px, 1048px);
    column-gap: 30px;
    row-gap: 14px;
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

.salary-composition-form__select {
    width: 100%;
}

.salary-composition-form__select--medium {
    max-width: 394px;
}

.salary-composition-form__select :deep(select) {
    width: 100%;
    min-width: 0;
    height: 34px;
    border-color: #cfd4da;
    font-size: 13px;
    color: #001b44;
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

.salary-composition-form-scroll {
    scrollbar-gutter: stable;
}

@media (max-width: 900px) {
    .salary-composition-form {
        grid-template-columns: 1fr;
        row-gap: 10px;
    }

    .salary-composition-form__label {
        min-height: auto;
        padding-top: 8px;
    }
}
</style>
