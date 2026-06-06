<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import MsInput from '@/components/base/MsInput.vue';
import MsSelect, { type MsSelectOption } from '@/components/base/MsSelect.vue';
import MsTreeView from '@/components/base/tree_view/MsTreeView.vue';
import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    IncomeTaxType,
    SourceType,
    ValueType,
} from '@/enums/salaryCompositionEnums';
import {
    autoSumEmployeeTypeText,
    compositionNatureText,
    compositionTypeText,
    sourceTypeText,
    valueTypeText,
} from '@/constants/salaryCompositionLabels';
import type { GetOrganizationTreeResponse } from '@/types/organization';
import type { SalaryCompositionFormMode, SalaryCompositionFormModel } from '@/types/salaryComposition';

interface SalaryCompositionFormProps {
    mode: SalaryCompositionFormMode
    modelValue: SalaryCompositionFormModel
    organizationItems?: GetOrganizationTreeResponse[]
}

const props = withDefaults(defineProps<SalaryCompositionFormProps>(), {
    organizationItems: () => [],
});

const emit = defineEmits<{
    'update:modelValue': [value: SalaryCompositionFormModel]
    submit: []
}>();

const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);

const isViewMode = computed(() => props.mode === 'view');

const compositionTypeOptions = computed<MsSelectOption[]>(() => [
    { value: null, label: '' },
    ...Object.values(CompositionType)
        .filter((value): value is CompositionType => typeof value === 'number')
        .map((value) => ({
            value,
            label: compositionTypeText[value],
        })),
]);

const natureOptions = computed<MsSelectOption[]>(() =>
    Object.values(CompositionNature)
        .filter((value): value is CompositionNature => typeof value === 'number')
        .map((value) => ({
            value,
            label: compositionNatureText[value],
        }))
);

const valueTypeOptions = computed<MsSelectOption[]>(() =>
    Object.values(ValueType)
        .filter((value): value is ValueType => typeof value === 'number')
        .map((value) => ({
            value,
            label: valueTypeText[value],
        }))
);

const valueScopeOptions = computed<MsSelectOption[]>(() =>
    Object.values(AutoSumEmployeeType)
        .filter((value): value is AutoSumEmployeeType => typeof value === 'number')
        .map((value) => ({
            value,
            label: autoSumEmployeeTypeText[value],
        }))
);

const sourceOptions = computed<MsSelectOption[]>(() =>
    Object.values(SourceType)
        .filter((value): value is SourceType => typeof value === 'number')
        .map((value) => ({
            value,
            label: sourceTypeText[value],
        }))
);

const organizationById = computed(() => {
    const map = new Map<string, GetOrganizationTreeResponse>();

    const traverse = (items: GetOrganizationTreeResponse[]) => {
        items.forEach((organization) => {
            map.set(organization.id, organization);
            traverse(organization.children ?? []);
        });
    };

    traverse(props.organizationItems);

    return map;
});

const selectedOrganizations = computed(() =>
    props.modelValue.organizationIds
        .map((id) => organizationById.value.get(id))
        .filter((organization): organization is GetOrganizationTreeResponse => Boolean(organization))
);

const selectedCount = computed(() => props.modelValue.organizationIds.length);
const primaryOrganization = computed(() =>
    selectedOrganizations.value[selectedOrganizations.value.length - 1] ?? null
);

function updateForm<K extends keyof SalaryCompositionFormModel>(
    key: K,
    value: SalaryCompositionFormModel[K]
) {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value,
    });
}

function toggleOrganizationDropdown() {
    if (isViewMode.value) {
        return;
    }

    isOrganizationDropdownOpen.value = !isOrganizationDropdownOpen.value;
}

function closeOrganizationDropdown() {
    isOrganizationDropdownOpen.value = false;
}

function updateSelectedOrganizationIds(ids: string[]) {
    if (isViewMode.value) {
        return;
    }

    updateForm('organizationIds', ids);
}

function removeOrganization(id: string) {
    if (isViewMode.value) {
        return;
    }

    updateSelectedOrganizationIds(
        props.modelValue.organizationIds.filter((selectedId) => selectedId !== id)
    );
}

function handleDocumentPointerDown(event: PointerEvent) {
    if (!isOrganizationDropdownOpen.value) {
        return;
    }

    const target = event.target as Node | null;

    if (target && organizationDropdownRef.value?.contains(target)) {
        return;
    }

    closeOrganizationDropdown();
}

function handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeOrganizationDropdown();
    }
}

function handleSubmit() {
    if (isViewMode.value) {
        return;
    }

    emit('submit');
}

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>

<template>
    <div class="salary-composition-form-scroll h-full overflow-y-auto px-12 pb-22 pt-5">
        <form class="salary-composition-form" @submit.prevent="handleSubmit">
            <label class="salary-composition-form__label" for="composition-name">
                Tên thành phần <span class="text-error">*</span>
            </label>
            <MsInput id="composition-name" class="salary-composition-form__input" :value="modelValue.name"
                :disabled="isViewMode" @update:model-value="value => updateForm('name', String(value))" />

            <label class="salary-composition-form__label" for="composition-code">
                Mã thành phần <span class="text-error">*</span>
            </label>
            <MsInput id="composition-code" class="salary-composition-form__input" :value="modelValue.code"
                :disabled="isViewMode" placeholder="Nhập mã viết liền"
                @update:model-value="value => updateForm('code', String(value))" />

            <label class="salary-composition-form__label">
                Đơn vị áp dụng <span class="text-error">*</span>
            </label>
            <div ref="organizationDropdownRef" class="relative">
                <button type="button" class="salary-composition-form__field flex w-full items-center justify-between gap-2 px-2"
                    :aria-expanded="isOrganizationDropdownOpen" :disabled="isViewMode" @click="toggleOrganizationDropdown">
                    <span class="inline-flex min-w-0 items-center gap-1">
                        <template v-if="selectedCount > 0">
                            <span v-if="selectedCount > 1" class="salary-composition-form__organization-count">
                                {{ selectedCount }}
                            </span>

                            <span v-if="primaryOrganization" class="salary-composition-form__organization-chip">
                                <span class="truncate">{{ primaryOrganization.name }}</span>
                                <span v-if="!isViewMode" class="salary-composition-form__organization-remove"
                                    role="button" tabindex="0" :aria-label="`Bỏ chọn ${primaryOrganization.name}`"
                                    @click.stop="removeOrganization(primaryOrganization.id)"
                                    @keydown.enter.stop.prevent="removeOrganization(primaryOrganization.id)"
                                    @keydown.space.stop.prevent="removeOrganization(primaryOrganization.id)">
                                    <svg class="size-4 shrink-0 text-[#5f6673]" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" aria-hidden="true">
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </span>
                            </span>
                        </template>

                        <span v-else class="truncate text-text-placeholder">Đơn vị áp dụng</span>
                    </span>

                    <svg class="size-4 shrink-0 text-text-secondary transition-transform"
                        :class="isOrganizationDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                <div v-if="isOrganizationDropdownOpen" class="absolute left-0 top-full z-10000 mt-1 w-full overflow-hidden
                         rounded-lg border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
                    <MsTreeView :items="organizationItems" :selected-keys="modelValue.organizationIds" key-expr="id"
                        parent-id-expr="parentId" display-expr="name" class="max-h-64 overflow-auto py-1"
                        @update:selected-keys="updateSelectedOrganizationIds">
                        <template #item="{ item }">
                            <span class="block truncate" :class="item.hasChildren ? 'font-medium' : ''">
                                {{ item.name }}
                            </span>
                        </template>
                    </MsTreeView>
                </div>
            </div>

            <label class="salary-composition-form__label" for="composition-type">
                Loại thành phần <span class="text-error">*</span>
            </label>
            <MsSelect id="composition-type" :model-value="modelValue.compositionType" :options="compositionTypeOptions"
                :disabled="isViewMode" class="salary-composition-form__select salary-composition-form__select--medium"
                @update:model-value="value => updateForm('compositionType', value as CompositionType | null)" />

            <label class="salary-composition-form__label" for="nature">
                Tính chất <span class="text-error">*</span>
            </label>
            <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
                <MsSelect id="nature" :model-value="modelValue.compositionNature" :options="natureOptions"
                    :disabled="isViewMode" class="salary-composition-form__select salary-composition-form__select--medium"
                    @update:model-value="value => updateForm('compositionNature', value as CompositionNature)" />

                <label class="salary-composition-form__radio">
                    <input type="radio" name="tax-status" :disabled="isViewMode"
                        :checked="modelValue.incomeTaxType === IncomeTaxType.Taxable"
                        @change="updateForm('incomeTaxType', IncomeTaxType.Taxable)">
                    <span>Chịu thuế</span>
                </label>

                <label class="salary-composition-form__radio">
                    <input type="radio" name="tax-status" :disabled="isViewMode"
                        :checked="modelValue.incomeTaxType === IncomeTaxType.TaxFree"
                        @change="updateForm('incomeTaxType', IncomeTaxType.TaxFree)">
                    <span>Miễn thuế toàn phần</span>
                </label>

                <label class="salary-composition-form__radio">
                    <input type="radio" name="tax-status" :disabled="isViewMode"
                        :checked="modelValue.incomeTaxType === IncomeTaxType.PartialTaxFree"
                        @change="updateForm('incomeTaxType', IncomeTaxType.PartialTaxFree)">
                    <span>Miễn thuế một phần</span>
                </label>
            </div>

            <label class="salary-composition-form__label" for="limit">Định mức</label>
            <textarea id="limit" class="salary-composition-form__textarea h-22" :value="modelValue.quotaFormula"
                :readonly="isViewMode" placeholder="Tự động gợi ý công thức và tham số khi gõ"
                @input="event => updateForm('quotaFormula', (event.target as HTMLTextAreaElement).value)"></textarea>

            <div></div>
            <label class="flex h-7 items-center gap-2.5 text-[13px] text-[#001b44]">
                <input type="checkbox" class="size-4 rounded border-[#cfd4da] accent-primary" :disabled="isViewMode"
                    :checked="modelValue.allowToExceedQuota"
                    @change="event => updateForm('allowToExceedQuota', (event.target as HTMLInputElement).checked)">
                <span>Cho phép giá trị tính vượt quá định mức</span>
                <span class="inline-flex size-5 items-center justify-center rounded-full border border-[#7d8591]
                         text-[13px] font-bold text-[#6b7280]">i</span>
            </label>

            <label class="salary-composition-form__label" for="value-type">Kiểu giá trị</label>
            <MsSelect id="value-type" :model-value="modelValue.valueType" :options="valueTypeOptions"
                :disabled="isViewMode" class="salary-composition-form__select salary-composition-form__select--medium"
                @update:model-value="value => updateForm('valueType', value as ValueType)" />

            <label class="salary-composition-form__label">Giá trị</label>
            <div class="flex flex-col gap-3">
                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method" :disabled="isViewMode"
                        :checked="modelValue.isAutoSumEmployee"
                        @change="updateForm('isAutoSumEmployee', true)">
                    <span>Tự động cộng tổng giá trị của các nhân viên</span>
                </label>

                <MsSelect :model-value="modelValue.autoSumEmployeeType" :options="valueScopeOptions"
                    :disabled="isViewMode || !modelValue.isAutoSumEmployee"
                    class="salary-composition-form__select salary-composition-form__select--medium"
                    @update:model-value="value => updateForm('autoSumEmployeeType', value as AutoSumEmployeeType)" />

                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method" :disabled="isViewMode"
                        :checked="!modelValue.isAutoSumEmployee"
                        @change="updateForm('isAutoSumEmployee', false)">
                    <span>Tính theo công thức tự đặt</span>
                </label>

                <div class="relative max-w-262">
                    <textarea class="salary-composition-form__textarea h-22" :value="modelValue.valueFormula"
                        :readonly="isViewMode || modelValue.isAutoSumEmployee"
                        placeholder="Tự động gợi ý công thức và tham số khi gõ"
                        @input="event => updateForm('valueFormula', (event.target as HTMLTextAreaElement).value)">
                    </textarea>
                </div>
            </div>

            <label class="salary-composition-form__label" for="description">Mô tả</label>
            <textarea id="description" class="salary-composition-form__textarea h-22" :value="modelValue.description"
                :readonly="isViewMode"
                @input="event => updateForm('description', (event.target as HTMLTextAreaElement).value)"></textarea>

            <label class="salary-composition-form__label">Hiển thị trên phiếu lương</label>
            <div class="flex flex-wrap items-center gap-6">
                <label class="salary-composition-form__radio">
                    <input type="radio" name="show-on-payroll" :disabled="isViewMode"
                        :checked="modelValue.optionShowPaycheck === 1"
                        @change="updateForm('optionShowPaycheck', 1)">
                    <span>Có</span>
                </label>

                <label class="salary-composition-form__radio">
                    <input type="radio" name="show-on-payroll" :disabled="isViewMode"
                        :checked="modelValue.optionShowPaycheck === 2"
                        @change="updateForm('optionShowPaycheck', 2)">
                    <span>Không</span>
                </label>

                <label class="salary-composition-form__radio">
                    <input type="radio" name="show-on-payroll" :disabled="isViewMode"
                        :checked="modelValue.optionShowPaycheck === 3"
                        @change="updateForm('optionShowPaycheck', 3)">
                    <span>Chỉ hiển thị nếu giá trị khác 0</span>
                </label>
            </div>

            <label class="salary-composition-form__label" for="source">Nguồn tạo</label>
            <MsSelect id="source" :model-value="modelValue.sourceType" :options="sourceOptions" disabled
                class="salary-composition-form__select salary-composition-form__select--medium" />
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

.salary-composition-form__input {
    width: 80%;
    padding: 0 9px;
}

.salary-composition-form__textarea {
    width: 80%;
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

.salary-composition-form__organization-count,
.salary-composition-form__organization-chip {
    display: inline-flex;
    height: 26px;
    min-width: 26px;
    max-width: 100%;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    background: #f8f9fb;
    color: #001b44;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
}

.salary-composition-form__organization-chip {
    min-width: 0;
    max-width: 280px;
    justify-content: flex-start;
    gap: 4px;
    padding: 0 8px;
}

.salary-composition-form__organization-remove {
    display: inline-flex;
    flex-shrink: 0;
    cursor: pointer;
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
