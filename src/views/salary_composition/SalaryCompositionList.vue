<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import { computed, onMounted, reactive, ref } from 'vue';
import gridConfigApi from '@/apis/gridConfigApi';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import SalaryCompositionLeftFilters from './SalaryCompositionLeftFilters.vue';
import SalaryCompositionRightActions from './SalaryCompositionRightActions.vue';
import gridKeys from '@/constants/gridKeys.ts';
import SalaryCompositionPagination from './SalaryCompositionPagination.vue';

const columns = ref<GetGridConfigsResponse[]>([]);
const salaryCompositions = ref<GetSalaryCompositionsResponse[]>([]);
const totalCount = ref(0);
const isTableLoading = ref(false);
const pageIndex = ref(1);
const pageSize = ref(3);

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
});

const rows = computed(() => {
    return salaryCompositions.value;
});

const rangeText = computed(() => rows.value.length ? `1 - ${rows.value.length}` : '0 - 0');

onMounted(async () => {
    try {
        isTableLoading.value = true;
        const gridData = await gridConfigApi.fetchGridConfigs(gridKeys.SALARY_COMPOSITION);
        columns.value = gridData.value;

        const salData = await salaryCompositionApi.fetchSalaryCompositions(queryObject.value);
        salaryCompositions.value = salData.value.items;
        totalCount.value = salData.value.totalCount;

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
                    <SalaryCompositionPagination />
                </div>
            </div>
        </div>
    </section>
</template>
