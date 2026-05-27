<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GridConfig } from '@/types/gridConfig.ts';

const salaryComponents = [
    {
        code: 'TEST',
        name: 'test',
        unit: 'cong ty tuyet voi',
        type: 'Thông tin nhân viên',
        property: 'Thu nhập',
        valueType: 'Tiền tệ',
        formula: '-',
    },
    {
        code: 'BAC',
        name: 'Bậc',
        unit: 'cong ty tuyet voi',
        type: 'Thông tin nhân viên',
        property: 'Khác',
        valueType: 'Chữ',
        formula: '-',
    },
]

// const columns: GridConfig[] = [
//     { fieldKey: 'code', columnName: 'Mã thành phần', width: '220px', pinned: true },
//     { key: 'name', label: 'Tên thành phần', width: '220px' },
//     { key: 'unit', label: 'Đơn vị áp dụng', width: '220px' },
//     { key: 'type', label: 'Loại thành phần', width: '220px' },
//     { key: 'property', label: 'Tính chất', width: '220px' },
//     { key: 'valueType', label: 'Kiểu giá trị', width: '220px' },
//     { key: 'formula', label: 'Công thức', width: '150px' },
// ]

const columns: GridConfig[] = [
    { fieldKey: 'code', columnName: 'Mã thành phần', isDisplayed: true, isPinned: false },
    { fieldKey: 'name', columnName: 'Tên thành phần', isDisplayed: true, isPinned: false },
    { fieldKey: 'unit', columnName: 'Đơn vị áp dụng', isDisplayed: true, isPinned: false },
    { fieldKey: 'type', columnName: 'Loại thành phần', isDisplayed: true, isPinned: false },
    { fieldKey: 'property', columnName: 'Tính chất', isDisplayed: true, isPinned: false },
    { fieldKey: 'valueType', columnName: 'Kiểu giá trị', isDisplayed: true, isPinned: false },
    { fieldKey: 'formula', columnName: 'Công thức', isDisplayed: true, isPinned: false },
]

const rows = [
    { id: '1', code: 'A001', name: 'Nguyễn Văn A', amount: 1200000 },
    { id: '2', code: 'A002', name: 'Trần Thị B', amount: 850000 },
];

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
                <!-- <table class="min-w-372.5 border-separate border-spacing-0 text-left text-[14px]">
                    <thead class="sticky top-0 z-10 bg-grid-header">
                        <tr>
                            <th class="h-9 w-12 border-b border-border px-4 text-center align-middle">
                                <input class="size-4 rounded border-[#cfd4da] text-primary focus:ring-primary/20"
                                    type="checkbox" aria-label="Chọn tất cả">
                            </th>
                            <th v-for="column in columns" :key="column.key"
                                class="h-9 border-b border-r border-border px-3 text-[13px] font-semibold text-[#001b44]"
                                :style="{ width: column.width }">
                                <span class="inline-flex items-center gap-2">
                                    <svg v-if="column.pinned" class="size-4 text-[#6b7280]" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" aria-hidden="true">
                                        <path d="M12 17v5" />
                                        <path d="M9 3h6l1 7 3 3H5l3-3Z" />
                                    </svg>
                                    {{ column.label }}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in salaryComponents" :key="row.code" class="bg-white hover:bg-[#f8faf9]">
                            <td class="h-9 border-b border-border px-4 text-center">
                                <input class="size-4 rounded border-[#cfd4da] text-primary focus:ring-primary/20"
                                    type="checkbox" :aria-label="`Chọn ${row.code}`">
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.code }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.name }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.unit }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.type }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.property }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.valueType }}
                            </td>
                            <td class="h-9 border-b border-border px-3 text-[#001b44]">
                                {{ row.formula }}
                            </td>
                        </tr>
                    </tbody>
                </table> -->
                <SalaryCompositionTable :rows="rows" :columns="columns" />
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

    <button
        class="absolute right-0 top-1/2 z-20 flex h-10 w-5 -translate-y-1/2 items-center justify-center rounded-l bg-[#0b84ff] text-white shadow"
        type="button" aria-label="Mở tiện ích bên phải">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
        </svg>
    </button>

    <div
        class="absolute right-0 top-[390px] z-20 flex w-[70px] flex-col items-center gap-3 rounded-l-lg bg-white py-3 shadow-[0_2px_16px_rgba(0,0,0,0.16)]">
        <button class="flex size-12 items-center justify-center rounded-full bg-[#0cc584] text-white" type="button"
            aria-label="Trợ lý">
            <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path
                    d="M12 3a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h1v-6H5v-2a7 7 0 0 1 14 0v2h-3v6h1a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8Z" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
            </svg>
        </button>
        <button class="flex size-12 items-center justify-center rounded-full bg-[#ff594a] text-white" type="button"
            aria-label="Tính năng nổi bật">
            <svg class="size-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                    d="M13.5 2.8 15 8.3l5.2 1.9-5.2 1.9-1.5 5.5-1.5-5.5-5.2-1.9L12 8.3l1.5-5.5ZM5.8 13.7l.8 3 2.8.9-2.8 1-.8 3-.9-3-2.8-1 2.8-.9.9-3Z" />
            </svg>
        </button>
        <button class="flex size-12 items-center justify-center rounded-full bg-[#496bff] text-white" type="button"
            aria-label="Tin nhắn">
            <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.3-5.2A8 8 0 1 1 21 12Z" />
                <path d="M8 12h.01" />
                <path d="M12 12h.01" />
                <path d="M16 12h.01" />
            </svg>
        </button>
    </div>
</template>
