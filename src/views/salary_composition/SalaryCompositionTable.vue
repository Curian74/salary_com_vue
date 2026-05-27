<script setup lang='ts'>
import MsTable from '@/components/base/MsTable.vue';
import type { GridConfig } from '@/types/gridConfig'
import type { TableRow } from '@/types/tableRow'
import { computed } from 'vue';

interface SalaryCompositionTableProps {
    columns: GridConfig[];
    rows: TableRow[];
}

const props = defineProps<SalaryCompositionTableProps>();

const activeTableColumns = computed(() => {
    return props.columns.filter(c => c.isDisplayed)
})

</script>
<template>
    <MsTable class="min-w-372.5 border-separate border-spacing-0 text-left text-[14px]" :columns="activeTableColumns"
        :rows="rows" />
</template>
<style scoped></style>