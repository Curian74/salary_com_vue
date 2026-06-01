<script setup lang="ts" generic="T extends Record<string, any>">
import type { GridConfig } from '@/types/gridConfig'
import { computed } from 'vue';
import MsLoading from './MsLoading.vue';
import MsIcon from './MsIcon.vue';

interface MsTableProps {
    columns: GridConfig[];
    rows: T[];
    isLoading?: boolean;
    formatters?: Record<string, (value: any, row: T) => string>
}

const props = defineProps<MsTableProps>();

const visibleColumns = computed(() => {
    return props.columns.filter(x => x.isDisplayed);
})

const tableColspan = computed(() => visibleColumns.value.length + 1)

</script>
<template>
    <table v-bind="$attrs">
        <thead class="sticky top-0 z-10 bg-grid-header">
            <tr>
                <th class="h-9 w-12 border-b border-border px-4 text-center align-middle">
                    <input class="size-4 rounded border-[#cfd4da] text-primary focus:ring-primary/20" type="checkbox">
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
                    <input class="size-3.5 rounded border-[#cfd4da] 
                    text-primary focus:ring-primary/20" type="checkbox" />
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
