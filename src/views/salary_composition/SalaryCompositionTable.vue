<script setup lang='ts'>
import MsStatus from '@/components/base/MsStatus.vue';
import MsTable from '@/components/base/MsTable.vue';
import {
    AutoSumEmployeeType, CompositionNature, CompositionType, DeductionType,
    IncomeTaxType, SourceType, TrackingStatus, ValueType
}
    from '@/enums/salaryCompositionEnums';
import {
    autoSumEmployeeTypeText,
    compositionNatureText,
    compositionTypeText,
    deductionTypeText,
    incomeTaxTypeText,
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

const formatters = {
    autoSumEmployeeType: (value: AutoSumEmployeeType) => autoSumEmployeeTypeText[value] ?? '--',
    compositionNature: (value: CompositionNature) => compositionNatureText[value] ?? '--',
    compositionType: (value: CompositionType) => compositionTypeText[value] ?? '--',
    deductionType: (value: DeductionType) => deductionTypeText[value] ?? '--',
    incomeTaxType: (value: IncomeTaxType) => incomeTaxTypeText[value] ?? '--',
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
    valueType: 14,
    valueFormula: 26,
    description: 34,
    optionShowPaycheck: 16,
}

const columnWidths = {
    code: 180,
    name: 150,
    organizationUnitNames: 220,
    compositionNature: 100,
    compositionType: 120,
    incomeTaxType: 110,
    deductionType: 110,
    valueType: 100,
    valueFormula: 180,
    description: 240,
    optionShowPaycheck: 130,
    sourceType: 120,
    status: 140,
    autoSumEmployeeType: 160,
}

const props = defineProps<SalaryCompositionTableProps>();

</script>
<template>
    <MsTable class="border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading" :columns="columns"
        :rows="rows" :formatters="formatters" :column-widths="columnWidths"
        :max-chars-by-column="maxCharsByColumn">

        <template #status="{ row }">
            <MsStatus :text="trackingStatusText[row.status] ?? '--'"
                :variant="row.status === TrackingStatus.Active ? 'success' : 'warning'" />
        </template>

    </MsTable>
</template>
<style scoped></style>
