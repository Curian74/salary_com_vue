<script setup lang='ts'>
import MsStatus from '@/components/base/MsStatus.vue';
import MsTable from '@/components/base/MsTable.vue';
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
    'update:selectedSalaryCompositionIds': [ids: string[]]
}>();

const tableRef = ref<{ clearSelection: () => void } | null>(null);

const clearSelection = () => {
    tableRef.value?.clearSelection();
};

defineExpose({
    clearSelection,
});

</script>
<template>
    <MsTable ref="tableRef" class="border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading"
        :columns="columns" :rows="rows" :row-key="salaryCompositionRowKey" :formatters="formatters"
        :column-widths="columnWidths" :max-chars-by-column="maxCharsByColumn"
        @selection-count-change="emit('selection-count-change', $event)"
        @selection-change="emit('update:selectedSalaryCompositionIds', $event)">

        <template #status="{ row }">
            <MsStatus :text="trackingStatusText[row.status] ?? '--'"
                :variant="row.status === TrackingStatus.Active ? 'success' : 'warning'" />
        </template>

    </MsTable>
</template>
<style scoped></style>
