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
    columnWidths?: Record<string, number>;
    defaultColumnWidth?: number;
    maxChars?: number;
    maxCharsByColumn?: Record<string, number>;
}

const props = defineProps<MsTableProps>();
const emit = defineEmits<{
    'selection-count-change': [count: number]
}>();

const selectedRowKeys = ref(new Set<string>());
const selectionColumnWidth = 48;
const defaultColumnWidth = 140;
const defaultMaxChars = 28;
const selectedCount = computed(() => selectedRowKeys.value.size);

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
    return [...props.columns]
        .filter(x => x.isDisplayed)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
})

const tableColspan = computed(() => visibleColumns.value.length + 1);

const tableMinWidth = computed(() => {
    return visibleColumns.value.reduce((total, column) => {
        return total + (getRenderedColumnWidth(column) ?? 0);
    }, selectionColumnWidth);
});

const hasColumnWidths = computed(() => {
    return visibleColumns.value.some(column => props.columnWidths?.[column.fieldKey] !== undefined);
});

const tableStyle = computed(() => {
    if (!hasColumnWidths.value) {
        return { width: '100%' };
    }

    return {
        minWidth: `${tableMinWidth.value}px`,
        width: `max(100%, ${tableMinWidth.value}px)`,
    };
});

const getRowKey = (row: T) => {
    return props.rowKey ? row[props.rowKey] : row.code;
}

const getColumnWidth = (column: GridConfig) => {
    return props.columnWidths?.[column.fieldKey] ?? null;
}

const getRenderedColumnWidth = (column: GridConfig) => {
    return getColumnWidth(column)
        ?? (hasColumnWidths.value ? props.defaultColumnWidth ?? defaultColumnWidth : null);
}

const getColumnMaxChars = (column: GridConfig) => {
    return props.maxCharsByColumn?.[column.fieldKey]
        ?? props.maxChars
        ?? defaultMaxChars;
}

const getCellRawText = (row: T, column: GridConfig) => {
    const value = props.formatters?.[column.fieldKey]?.(row[column.fieldKey], row)
        ?? row[column.fieldKey]
        ?? '--';

    return String(value);
}

const getCellText = (row: T, column: GridConfig) => {
    const text = getCellRawText(row, column);
    const maxChars = getColumnMaxChars(column);

    if (text.length <= maxChars) {
        return text;
    }

    return `${text.slice(0, maxChars).trimEnd()}...`;
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

const clearSelection = () => {
    selectedRowKeys.value = new Set();
}

watch(
    () => props.rows,
    (rows) => {
        const rowKeys = new Set(rows.map(getRowKey));
        const nextSelectedRowKeys = new Set(
            [...selectedRowKeys.value].filter((rowKey) => rowKeys.has(rowKey)),
        );

        if (nextSelectedRowKeys.size !== selectedRowKeys.value.size) {
            selectedRowKeys.value = nextSelectedRowKeys;
        }
    },
)

watch(
    selectedCount,
    (count) => {
        // Đẩy số dòng được chọn lên parent để đổi toolbar/filter bên ngoài table
        emit('selection-count-change', count);
    },
    { immediate: true },
)

defineExpose({
    clearSelection,
});

</script>
<template>
    <table v-bind="$attrs" class="ms-table table-fixed" :style="tableStyle">
        <colgroup>
            <col :style="{ width: `${selectionColumnWidth}px` }">
            <col v-for="column in visibleColumns" :key="column.fieldKey"
                :style="getRenderedColumnWidth(column) ? { width: `${getRenderedColumnWidth(column)}px` } : undefined">
        </colgroup>

        <thead class="sticky top-0 z-10 bg-grid-header">
            <tr>
                <th class="h-10 w-12 border-b border-border px-4 text-center align-middle">
                    <ms-checkbox @change="handleSelectAll" :checked="isAllSelected"
                        :indeterminate="isIndeterminate"></ms-checkbox>
                </th>

                <th class="ms-table__head-cell h-10 border-b border-r border-border px-3 text-[13px] font-semibold text-[#001b44]"
                    v-for="column in visibleColumns" :key="column.fieldKey" :title="column.columnName">
                    <span class="ms-table__header-content text-[13px]">
                        <svg v-if="column.isPinned" class="size-4 text-[#6b7280]" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M12 17v5" />
                            <path d="M9 3h6l1 7 3 3H5l3-3Z" />
                        </svg>
                        <span class="min-w-0 truncate">{{ column.columnName }}</span>
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
            <tr v-if="rows.length > 0" v-for="row in rows" :key="getRowKey(row)"
                class="hover:bg-[#cdeadf] hover:cursor-pointer"
                :class="isRowSelected(row) ? 'bg-[#cdeadf]' : 'bg-white'">
                <td class="h-10 border-b border-border px-4 text-center align-middle">
                    <ms-checkbox @change="checked => handleSelectRow(row, checked)" :checked="isRowSelected(row)">
                    </ms-checkbox>
                </td>
                <td v-for="column in visibleColumns" :key="column.fieldKey"
                    class="ms-table__cell h-10 border-b border-border px-3 text-[#001b44]"
                    :title="getCellRawText(row, column)">
                    <slot :name="column.fieldKey" :row="row" :column="column" :value="getCellRawText(row, column)"
                        :display-value="getCellText(row, column)">
                        <span class="ms-table__cell-content">{{ getCellText(row, column) }}</span>
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

<style scoped>
.ms-table {
    table-layout: fixed;
}

.ms-table__head-cell,
.ms-table__cell {
    box-sizing: border-box;
    max-width: 0;
}

.ms-table__header-content {
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    gap: 8px;
}

.ms-table__header-content svg {
    flex-shrink: 0;
}

.ms-table__cell {
    vertical-align: middle;
}

.ms-table__cell-content {
    display: block;
    overflow: hidden;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
