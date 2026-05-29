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
                    <div class="flex items-center gap-2">
                        <span>Số dòng/trang</span>
                        <MsButton variant="secondary" class="min-w-23 justify-between font-normal">
                            <span>25</span>
                            <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </MsButton>
                    </div>

                    <strong class="whitespace-nowrap">{{ rangeText }}</strong>

                    <div class="flex items-center gap-4 text-[#cfd4da]">
                        <MsButton variant="icon" size="sm"
                            class="size-5 border-0 bg-transparent p-0 text-[#cfd4da] hover:bg-transparent"
                            aria-label="Trang đầu">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m11 17-5-5 5-5" />
                                <path d="M18 17V7" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="size-5 border-0 bg-transparent p-0 text-[#cfd4da] hover:bg-transparent"
                            aria-label="Trang trước">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="size-5 border-0 bg-transparent p-0 text-[#cfd4da] hover:bg-transparent"
                            aria-label="Trang sau">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="size-5 border-0 bg-transparent p-0 text-[#cfd4da] hover:bg-transparent"
                            aria-label="Trang cuối">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m13 17 5-5-5-5" />
                                <path d="M6 17V7" />
                            </svg>
                        </MsButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
