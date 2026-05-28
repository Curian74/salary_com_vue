<script setup lang='ts'>
import MsTable from '@/components/base/MsTable.vue';
import type { GridConfig } from '@/types/gridConfig'
import type { GetSalaryCompositionsResponse }
    from '@/types/salaryComposition'

interface SalaryCompositionTableProps {
    columns: GridConfig[];
    rows: GetSalaryCompositionsResponse[];
    isLoading?: boolean;
}

const props = defineProps<SalaryCompositionTableProps>();

</script>
<template>
    <MsTable class="min-w-372.5 border-separate border-spacing-0 text-left text-[14px]" :is-loading="isLoading"
        :columns="columns" :rows="rows">

        <template #status="{ row }">
            {{ row.status === 1 ? 'Đang theo dõi' : 'Ngừng theo dõi' }}
        </template>

    </MsTable>
</template>
<style scoped></style>