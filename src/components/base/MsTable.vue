<script setup lang="ts" generic="T extends Record<string, any>">
import type { GridConfig } from '@/types/gridConfig'
import { computed, ref, watch } from 'vue';
import MsLoading from './MsLoading.vue';
import MsIcon from './MsIcon.vue';
import MsCheckbox from './MsCheckbox.vue';

interface MsTableProps {
    columns: GridConfig[];
    rows: T[];
    isLoading?: boolean;
    formatters?: Record<string, (value: any, row: T) => string>
    rowKey?: keyof T;
}

const props = defineProps<MsTableProps>();
const selectedRowKeys = ref(new Set<string>());

const isAllSelected = computed(() => {
    // Kiểm tra xem selectedKeys có chứa tất cả row từ data gốc
    return props.rows.length > 0
        && props.rows
            .every(r => selectedRowKeys.value.has(getRowKey(r)));
})

const isIndeterminate = computed(() => {
    // Đếm số selected và check selected length nhỏ hơn
    // tổng rows.length 
    const selectedCount = props.rows.filter(row =>
        selectedRowKeys.value.has(getRowKey(row))
    ).length;

    return selectedCount > 0 && selectedCount < props.rows.length;
});

const visibleColumns = computed(() => {
    return props.columns.filter(x => x.isDisplayed);
})

const tableColspan = computed(() => visibleColumns.value.length + 1);

const getRowKey = (row: T) => {
    return props.rowKey ? row[props.rowKey] : row.code;
}

const handleSelectAll = () => {
    const newSet = new Set(selectedRowKeys.value);

    // Xóa hết selected row nếu đã selected all
    if (isAllSelected.value) {
        props.rows.forEach(r => {
            newSet.delete(getRowKey(r));
        });
    }
    // Toggle all khi chọn 1 phần hoặc chưa chọn
    else {
        props.rows.forEach(r => {
            newSet.add(getRowKey(r));
        });
    }
    selectedRowKeys.value = newSet;
}

const isRowSelected = (row: T) => {
    return selectedRowKeys.value.has(getRowKey(row));
}

const handleSelectRow = (row: T, checked: boolean) => {
    const newSet = new Set(selectedRowKeys.value);
    const rowKey = getRowKey(row);

    if (checked) newSet.add(rowKey);
    else newSet.delete(rowKey);

    selectedRowKeys.value = newSet;
}

watch(selectedRowKeys, () => {
    console.log("Đã chọn " + selectedRowKeys.value.size + " bản ghi")
})

</script>
<template>
    <table v-bind="$attrs">
        <thead class="sticky top-0 z-10 bg-grid-header">
            <tr>
                <th class="h-9 w-12 border-b border-border px-4 text-center align-middle">
                    <ms-checkbox @change="handleSelectAll" :checked="isAllSelected"
                        :indeterminate="isIndeterminate"></ms-checkbox>
                </th>

                <th class="h-9 border-b border-r border-border px-3 text-[13px] font-semibold text-[#001b44]"
                    v-for="column in visibleColumns" :key="column.fieldKey">
                    <span class="inline-flex items-center gap-2 text-[13px]">
                        <svg v-if="column.isPinned" class="size-4 text-[#6b7280]" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M12 17v5" />
                            <path d="M9 3h6l1 7 3 3H5l3-3Z" />
                        </svg>
                        {{ column.columnName }}
                    </span>
                </th>
            </tr>
        </thead>

        <tbody v-if="isLoading">
            <tr>
                <td :colspan="tableColspan" class="h-40 border-border text-center text-primary">
                    <div class="flex items-center justify-center gap-3 text-[13px] font-medium">
                        <ms-loading size="lg" />
                    </div>
                </td>
            </tr>
        </tbody>

        <tbody v-else>
            <tr v-if="rows.length > 0" v-for="row in rows" :key="row.code"
                class="bg-white hover:bg-[#cdeadf] hover:cursor-pointer">
                <td class="h-9 border-b border-border px-4 text-center">
                    <ms-checkbox @change="checked => handleSelectRow(row, checked)" :checked="isRowSelected(row)">
                    </ms-checkbox>
                </td>
                <td v-for="column in visibleColumns" :key="column.fieldKey"
                    class="h-9 border-b border-border px-3 text-[#001b44]">
                    <slot :name="column.fieldKey" :row="row" :column="column">
                        {{ formatters?.[column.fieldKey]?.(row[column.fieldKey], row)
                            ?? row[column.fieldKey] ?? '--' }}
                    </slot>
                </td>
            </tr>

            <tr v-else>
                <td :colspan="tableColspan" class="h-80">
                    <div class="sticky left-0 flex h-full w-screen max-w-full flex-col items-center
                         justify-center gap-2 text-[13px] text-text-primary">
                        <ms-icon name="table-not-found" class="cursor-default" />
                        <span>Không có dữ liệu</span>
                    </div>
                </td>
            </tr>

        </tbody>
    </table>
</template>

<style scoped></style>
