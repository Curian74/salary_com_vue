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

const props = defineProps<SalaryCompositionTableProps>();

</script>
<template>
    <MsTable class="min-w-372.5 border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading"
        :columns="columns" :rows="rows" :formatters="formatters">

        <template #status="{ row }">
            <MsStatus :text="trackingStatusText[row.status] ?? '--'"
                :variant="row.status === TrackingStatus.Active ? 'success' : 'warning'" />
        </template>

    </MsTable>
</template>
<style scoped></style>
