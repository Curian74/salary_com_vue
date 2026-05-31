<script setup lang='ts' generic="T">
import MsSelect, { type MsSelectOption } from '@/components/base/MsSelect.vue';
import MsTablePagination from '@/components/base/MsTablePagination.vue';
import type { PagedResult } from '@/types/apiResponse.ts';

interface Props {
    data: PagedResult<T>
    pageSize: number
    pageSizeOptions: MsSelectOption[]
}

const props = defineProps<Props>();

const emit = defineEmits<{
    previousPage: [],
    nextPage: [],
    firstPage: [],
    lastPage: [],
    'update:pageSize': [value: number],
}>();

const handlePreviousPage = () => {
    emit('previousPage')
}

const handleNextPage = () => {
    emit('nextPage');
}

const handleFirstPage = () => {
    emit('firstPage');
}

const handleLastPage = () => {
    emit('lastPage');
}

const handlePageSizeChange = (value: string | number | null) => {
    if (typeof value !== 'number') {
        return;
    }

    emit('update:pageSize', value);
}

</script>
<template>
    <MsTablePagination @first-page="handleFirstPage" @last-page="handleLastPage" @previous-page="handlePreviousPage"
        @next-page="handleNextPage" :page-index="data.pageIndex" :data="data" :page-size="data.pageSize">

        <template #pageSizeConfig>
            <span>Số dòng/trang</span>
            <MsSelect :model-value="pageSize" :options="pageSizeOptions" @update:model-value="handlePageSizeChange" />
        </template>

    </MsTablePagination>
</template>
<style scoped></style>
