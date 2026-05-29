<script setup lang="ts">
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import { computed, onMounted, ref, watch } from 'vue';
import gridConfigApi from '@/apis/gridConfigApi';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import SalaryCompositionLeftFilters from './SalaryCompositionLeftFilters.vue';
import SalaryCompositionRightActions from './SalaryCompositionRightActions.vue';
import gridKeys from '@/constants/gridKeys.ts';
import SalaryCompositionPagination from './SalaryCompositionPagination.vue';
import type { PagedResult } from '@/types/apiResponse.ts';

const columns = ref<GetGridConfigsResponse[]>([]);
const isTableLoading = ref(false);
const pageIndex = ref(2);
const pageSize = ref(3);
const salaryCompositions = ref<PagedResult<GetSalaryCompositionsResponse>>({
    items: [],
    totalCount: 0,
    pageSize: pageSize.value,
    pageIndex: pageIndex.value,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
});

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
});

const rows = computed(() => {
    return salaryCompositions.value.items;
});

const totalCount = computed(() => salaryCompositions.value.totalCount);

const handlePreviousPage = () => {
    pageIndex.value--;
}

const handleNextPage = () => {
    pageIndex.value++;
}

const pagedData = computed(() => {
    return salaryCompositions.value;
})

const fetchSalaryCompositions = async () => {
    try {
        isTableLoading.value = true;

        const salData = await salaryCompositionApi.fetchSalaryCompositions({
            pageIndex: pageIndex.value,
            pageSize: pageSize.value,
        });

        salaryCompositions.value = salData.value;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        isTableLoading.value = false;
    }
}

watch(pageIndex, async () => {
    await fetchSalaryCompositions();
});

onMounted(async () => {
    try {
        isTableLoading.value = true;

        const gridData = await gridConfigApi.fetchGridConfigs(gridKeys.SALARY_COMPOSITION);
        columns.value = gridData.value;

        await fetchSalaryCompositions();
    }
    catch (err) {
        console.log(err);
    }
    finally {
        isTableLoading.value = false;
    }
});

</script>

<template>
    <section class="flex h-[calc(100vh-48px)] flex-col px-4 pb-2.5 pt-3">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-[20px] font-bold leading-8 text-text-primary">Thành phần lương</h2>
            <SalaryCompositionButtons />
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white">
            <div class="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
                <SalaryCompositionLeftFilters />
                <SalaryCompositionRightActions />
            </div>

            <div class="relative min-h-0 flex-1 overflow-auto">
                <SalaryCompositionTable :is-loading="isTableLoading" :rows="rows" :columns="columns" />
            </div>

            <div
                class="flex min-h-12.5 flex-wrap items-center justify-between gap-2 border-t border-border px-4 text-[14px] text-[#001b44]">
                <div>Tổng số: <span class="font-bold">{{ totalCount }}</span></div>

                <div class="flex flex-wrap items-center gap-4">
                    <SalaryCompositionPagination @next-page="handleNextPage" @previous-page="handlePreviousPage"
                        :data="pagedData" />
                </div>
            </div>
        </div>
    </section>
</template>
