<script setup lang='ts'>
import MsStatus from '@/components/base/MsStatus.vue';
import MsTable from '@/components/base/MsTable.vue';
import MsIcon from '@/components/base/MsIcon.vue';
import { ref } from 'vue';
import {
    AutoSumEmployeeType, CompositionNature, CompositionType, DeductionType,
    IncomeTaxType, OptionShowPaycheck, SourceType, TrackingStatus, ValueType
}
    from '@/enums/salaryCompositionEnums';
import {
    autoSumEmployeeTypeText,
    compositionNatureText,
    compositionTypeText,
    deductionTypeText,
    incomeTaxTypeText,
    optionShowPaycheckText,
    sourceTypeText,
    trackingStatusText,
    valueTypeText
} from '@/constants/salaryCompositionLabels';

import type { GridConfig } from '@/types/gridConfig'
import type { GetSalaryCompositionsResponse }
    from '@/types/salaryComposition'

interface SalaryCompositionTableProps {
    columns: GridConfig[];
    rows: GetSalaryCompositionsResponse[];
    isLoading?: boolean;
}

interface SalaryCompositionRowAction {
    key: SalaryCompositionRowActionKey
    label: string
    icon: string
    tone?: 'default' | 'success' | 'warning' | 'danger'
}

export interface SalaryCompositionRowActionPayload {
    action: SalaryCompositionRowActionKey
    row: GetSalaryCompositionsResponse
}

export type SalaryCompositionRowActionKey =
    | 'view'
    | 'edit'
    | 'delete'
    | 'activate'
    | 'duplicate'
    | 'deactivate';

const formatters: Record<string, (value: any, row: GetSalaryCompositionsResponse) => string> = {
    autoSumEmployeeType: (value: AutoSumEmployeeType) => autoSumEmployeeTypeText[value] ?? '--',
    compositionNature: (value: CompositionNature) => compositionNatureText[value] ?? '--',
    compositionType: (value: CompositionType) => compositionTypeText[value] ?? '--',
    deductionType: (value: DeductionType) => deductionTypeText[value] ?? '--',
    taxDeduction: (_value: DeductionType, row: GetSalaryCompositionsResponse) =>
        row.isTaxDeduction === true ? 'Có' : 'Không',
    incomeTaxType: (value: IncomeTaxType) => incomeTaxTypeText[value] ?? '--',
    optionShowPaycheck: (value: OptionShowPaycheck) => optionShowPaycheckText[value] ?? '--',
    showOnPayroll: (_value: any, row: GetSalaryCompositionsResponse) =>
        optionShowPaycheckText[row.optionShowPaycheck] ?? '--',
    quota: (_value: any, row: GetSalaryCompositionsResponse) => row.quotaFormula ?? '--',
    quotaFormula: (value: string | null) => value ?? '--',
    organizationUnitNames: (value: string | null, row: GetSalaryCompositionsResponse) =>
        row.organizations
            ?.map((organization) => organization.orgName)
            .filter(Boolean)
            .join(', ')
        || value
        || '--',
    sourceType: (value: SourceType) => sourceTypeText[value] ?? '--',
    status: (value: TrackingStatus) => trackingStatusText[value] ?? '--',
    valueType: (value: ValueType) => valueTypeText[value] ?? '--',
}

const maxCharsByColumn = {
    code: 22,
    name: 22,
    organizationUnitNames: 34,
    compositionNature: 14,
    compositionType: 16,
    incomeTaxType: 16,
    deductionType: 16,
    taxDeduction: 16,
    quota: 16,
    quotaFormula: 16,
    valueType: 14,
    valueFormula: 26,
    description: 34,
    optionShowPaycheck: 16,
    showOnPayroll: 18,
}

const columnWidths = {
    code: 180,
    name: 150,
    organizationUnitNames: 220,
    compositionNature: 100,
    compositionType: 120,
    incomeTaxType: 110,
    deductionType: 110,
    taxDeduction: 170,
    quota: 120,
    quotaFormula: 120,
    valueType: 100,
    valueFormula: 180,
    description: 240,
    optionShowPaycheck: 130,
    showOnPayroll: 180,
    sourceType: 120,
    status: 140,
    autoSumEmployeeType: 160,
}

// Salary composition dùng id làm khóa cho batch update/delete.
const salaryCompositionRowKey: keyof GetSalaryCompositionsResponse = 'id';
const props = defineProps<SalaryCompositionTableProps>();
const emit = defineEmits<{
    // Chuyển tiếp số dòng đang chọn từ MsTable để list điều khiển toolbar filter.
    'selection-count-change': [count: number]
    'update:selectedSalaryCompositionIds': [ids: string[]],
    'row-action': [payload: SalaryCompositionRowActionPayload]
    'row-click': [payload: SalaryCompositionRowActionPayload]
}>();

const tableRef = ref<{ clearSelection: () => void } | null>(null);

const clearSelection = () => {
    tableRef.value?.clearSelection();
};

const getRowActions = (row: GetSalaryCompositionsResponse): SalaryCompositionRowAction[] => {
    // Xét kiểu tracking status
    const trackingAction: SalaryCompositionRowAction =
        row.status === TrackingStatus.Active
            ? {
                key: 'deactivate',
                label: 'Ngừng theo dõi',
                icon: 'circle-minus',
                tone: 'warning',
            }
            : {
                key: 'activate',
                label: 'Đang theo dõi',
                icon: 'circle-check',
                tone: 'success',
            }

    // Trả về action cho row
    return [
        trackingAction,
        {
            key: 'duplicate',
            label: 'Nhân bản',
            icon: 'duplicate',
        },
        {
            key: 'edit',
            label: 'Sửa',
            icon: 'pencil',
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: 'trash',
            tone: 'danger',
        },
    ]
}

const getStatusText = (row: GetSalaryCompositionsResponse) => {
    return trackingStatusText[row.status] ?? '--';
}

const getStatusVariant = (row: GetSalaryCompositionsResponse) => {
    return row.status === TrackingStatus.Active ? 'success' : 'warning';
}

const handleRowAction = (
    action: SalaryCompositionRowAction,
    row: GetSalaryCompositionsResponse,
) => {

    emit('row-action', {
        action: action.key,
        row,
    });
}

const handleRowClick = (row: GetSalaryCompositionsResponse) => {
    const action: SalaryCompositionRowActionKey = 'view';

    const payload: SalaryCompositionRowActionPayload = {
        row,
        action: action,
    }

    emit('row-click', payload);
}

defineExpose({
    clearSelection,
});

</script>
<template>
    <MsTable ref="tableRef" class="border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading"
        :columns="columns" :rows="rows" :row-key="salaryCompositionRowKey" :formatters="formatters"
        :column-widths="columnWidths" :max-chars-by-column="maxCharsByColumn"
        @selection-count-change="emit('selection-count-change', $event)"
        @selection-change="emit('update:selectedSalaryCompositionIds', $event)" @row-click="handleRowClick($event)">

        <template #status="{ row }">
            <MsStatus :text="getStatusText(row)" :variant="getStatusVariant(row)" />
        </template>

        <template #row-actions="{ row }">
            <button v-for="action in getRowActions(row)" :key="action.key" type="button"
                class="salary-composition-table__row-action"
                :class="`salary-composition-table__row-action--${action.tone ?? 'default'}`" :aria-label="action.label"
                :title="action.label" @click="handleRowAction(action, row)">
                <MsIcon :name="action.icon" class="salary-composition-table__row-action-icon" />
            </button>
        </template>

    </MsTable>
</template>
<style scoped>
.salary-composition-table__row-action {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border: 1px solid #d6dde4;
    border-radius: 8px;
    background: #ffffff;
    color: #6f7782;
    cursor: pointer;
    padding: 0;
    transition:
        border-color 0.12s ease,
        background-color 0.12s ease,
        box-shadow 0.12s ease;
}

.salary-composition-table__row-action:hover {
    border-color: #c6d0da;
    background: #f8fafc;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.salary-composition-table__row-action--success {
    color: var(--app-color-primary);
}

.salary-composition-table__row-action--warning {
    color: #f58220;
}

.salary-composition-table__row-action--danger {
    color: var(--app-color-error);
}

.salary-composition-table__row-action-icon {
    cursor: inherit;
}

:deep(.ms-table__row-actions) {
    gap: 10px;
}

:deep(.ms-table__actions-cell) {
    padding-right: 10px;
}
</style>
