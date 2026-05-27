<script setup lang='ts'>
import MsTable from '@/components/base/MsTable.vue';
import type { GridConfig } from '@/types/gridConfig'
import type { TableRow } from '@/types/tableRow'

interface SalaryCompositionTableProps {
    columns: GridConfig[];
    rows: TableRow[];
    isLoading?: boolean;
}

const props = defineProps<SalaryCompositionTableProps>();

</script>
<template>
    <MsTable class="min-w-372.5 border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading"
        :columns="columns" :rows="rows" />
</template>
<style scoped></style>