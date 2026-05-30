<script setup lang='ts' generic="T">
import MsTablePagination from '@/components/base/MsTablePagination.vue';
import type { PagedResult } from '@/types/apiResponse.ts';

interface Props {
    data: PagedResult<T>
}

const props = defineProps<Props>();

const emit = defineEmits<{
    previousPage: [],
    nextPage: [],
    firstPage: [],
    lastPage: [],
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

</script>
<template>
    <MsTablePagination @first-page="handleFirstPage" @last-page="handleLastPage" @previous-page="handlePreviousPage"
        @next-page="handleNextPage" :page-index="data.pageIndex" :data="data" :page-size="data.pageSize">

    </MsTablePagination>
</template>
<style scoped></style>
