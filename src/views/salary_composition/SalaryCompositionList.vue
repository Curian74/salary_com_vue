<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import { onMounted, ref } from 'vue';
import gridConfigApi from '@/apis/gridConfigApi';

const columns = ref<GetGridConfigsResponse[]>([]);
const isTableLoading = ref(false);

const rows = [
    { id: '1', code: 'A001', name: 'Nguyễn Văn A', amount: 1200000 },
    { id: '2', code: 'A002', name: 'Trần Thị B', amount: 850000 },
];

onMounted(async () => {
    try {
        isTableLoading.value = true;
        const data = await gridConfigApi.fetchGridConfigs();
        columns.value = data.value;
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
                <SalaryCompositionSearch />

                <MsButton variant="secondary" class="!font-normal !text-[13px] text-text-secondary!">
                    <span>Trạng thái: <span class="font-semibold text-text-primary">Tất cả</span></span>
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </MsButton>

                <MsButton variant="secondary"
                    class="min-w-[260px] flex-1 max-w-[438px] justify-between! !font-normal !text-[13px] !text-text-placeholder">
                    <span>Tất cả đơn vị</span>
                    <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </MsButton>

                <div class="ml-auto flex items-center gap-2">
                    <MsButton variant="icon" type="button" aria-label="Lọc">
                        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M22 3H2l8 9.5V20l4-2v-5.5Z" />
                        </svg>
                    </MsButton>
                    <MsButton variant="icon" type="button" aria-label="Thiết lập bảng">
                        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
                            <path
                                d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.09 1.65V21a2 2 0 1 1-4 0v-.09a1.8 1.8 0 0 0-1.09-1.65 1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.65-1.09H3a2 2 0 1 1 0-4h.09A1.8 1.8 0 0 0 4.74 8.8a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 10.28 2.7V2.6a2 2 0 1 1 4 0v.09a1.8 1.8 0 0 0 1.09 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.65 1.09H21a2 2 0 1 1 0 4h-.09A1.8 1.8 0 0 0 19.4 15Z" />
                        </svg>
                    </MsButton>
                </div>
            </div>

            <div class="relative min-h-0 flex-1 overflow-auto">
                <SalaryCompositionTable :is-loading="isTableLoading" :rows="rows" :columns="columns" />
            </div>

            <div
                class="flex min-h-[50px] flex-wrap items-center justify-between gap-2 border-t border-border px-4 text-[14px] text-[#001b44]">
                <div>Tổng số: <span class="font-bold">2</span></div>

                <div class="flex flex-wrap items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span>Số dòng/trang</span>
                        <MsButton variant="secondary" class="min-w-[92px] !justify-between !font-normal">
                            <span>25</span>
                            <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </MsButton>
                    </div>

                    <strong class="whitespace-nowrap">1 - 2</strong>

                    <div class="flex items-center gap-4 text-[#cfd4da]">
                        <MsButton variant="icon" size="sm"
                            class="!size-5 !border-0 !bg-transparent !p-0 !text-[#cfd4da] hover:!bg-transparent"
                            aria-label="Trang đầu">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m11 17-5-5 5-5" />
                                <path d="M18 17V7" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="!size-5 !border-0 !bg-transparent !p-0 !text-[#cfd4da] hover:!bg-transparent"
                            aria-label="Trang trước">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="!size-5 !border-0 !bg-transparent !p-0 !text-[#cfd4da] hover:!bg-transparent"
                            aria-label="Trang sau">
                            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </MsButton>
                        <MsButton variant="icon" size="sm"
                            class="!size-5 !border-0 !bg-transparent !p-0 !text-[#cfd4da] hover:!bg-transparent"
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
