<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import type { MsMenuOption } from '@/components/base/MsMenu.vue';
import type { MsSelectOption } from '@/components/base/MsSelect.vue';
import { computed, ref } from 'vue';
import type { PagedResult } from '@/types/apiResponse.ts';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import type { GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import type { TrackingStatus } from '@/enums/salaryCompositionEnums';
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionOrganization from './SalaryCompositionOrganization.vue';
import SalaryCompositionPagination from './SalaryCompositionPagination.vue';
import SalaryCompositionRightActions from './SalaryCompositionRightActions.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';
import SalaryCompositionStatusFilter from './SalaryCompositionStatusFilter.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';

interface SalaryCompositionListProps {
    columns: GetGridConfigsResponse[]
    rows: GetSalaryCompositionsResponse[]
    isTableLoading?: boolean
    selectedStatus: TrackingStatus | null
    statusMenuOptions: MsMenuOption[]
    selectedOrganizationIds: string[]
    showInactiveOrganizations: boolean
    organizationItems?: GetOrganizationTreeResponse[]
    isOrganizationDropdownOpen: boolean
    totalCount: number
    pagedData: PagedResult<GetSalaryCompositionsResponse>
    pageSize: number
    pageSizeOptions: MsSelectOption[]
}

defineProps<SalaryCompositionListProps>();

const selectedTableRowCount = ref(0);
const tableRef = ref<{ clearSelection: () => void } | null>(null);
const hasSelectedTableRows = computed(() => selectedTableRowCount.value > 0);

// Gọi method được expose từ SalaryCompositionTable để xóa selection nội bộ của MsTable.
const clearTableSelection = () => {
    tableRef.value?.clearSelection();
};

const emit = defineEmits<{
    add: []
    search: [searchTerm: string]
    'update:status': [status: string | number | null]
    'update:organizationIds': [organizationIds: string[]]
    'update:showInactiveOrganizations': [value: boolean]
    toggleOrganizationDropdown: []
    'set-organization-dropdown-el': [element: HTMLElement | null]
    firstPage: []
    lastPage: []
    nextPage: []
    previousPage: []
    'update:pageSize': [pageSize: number]
}>();
</script>

<template>
    <section class="flex h-[calc(100vh-48px)] flex-col px-4 pb-2.5 pt-3">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-[20px] font-bold leading-8 text-text-primary">Thành phần lương</h2>
            <SalaryCompositionButtons @add="emit('add')" />
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white">
            <div class="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
                <SalaryCompositionSearch @search="emit('search', $event)" />

                <div v-if="hasSelectedTableRows" class="salary-composition-list__selection-toolbar">
                    <span class="salary-composition-list__selection-count">
                        Đã chọn <strong>{{ selectedTableRowCount }}</strong>
                    </span>

                    <MsButton variant="ghost" size="md" class="salary-composition-list__clear-selection"
                        @click="clearTableSelection">
                        Bỏ chọn
                    </MsButton>

                    <div class="salary-composition-list__selection-actions">
                        <MsButton variant="secondary" size="md"
                            class="salary-composition-list__selection-action salary-composition-list__selection-action--warning">
                            <template #prepend>
                                <svg class="salary-composition-list__selection-action-icon" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8 12h8" />
                                </svg>
                            </template>
                            Ngừng theo dõi
                        </MsButton>

                        <MsButton variant="secondary" size="md"
                            class="salary-composition-list__selection-action salary-composition-list__selection-action--success">
                            <template #prepend>
                                <svg class="salary-composition-list__selection-action-icon" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
                                </svg>
                            </template>
                            Đang theo dõi
                        </MsButton>

                        <MsButton variant="secondary" size="md"
                            class="salary-composition-list__selection-action salary-composition-list__selection-action--danger">
                            <template #prepend>
                                <svg class="salary-composition-list__selection-action-icon" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="m19 6-1 14H6L5 6" />
                                    <path d="M10 11v5" />
                                    <path d="M14 11v5" />
                                </svg>
                            </template>
                            Xóa
                        </MsButton>
                    </div>
                </div>

                <SalaryCompositionStatusFilter v-if="!hasSelectedTableRows" :status="selectedStatus"
                    :status-options="statusMenuOptions" @update:status="emit('update:status', $event)" />

                <SalaryCompositionOrganization v-if="!hasSelectedTableRows"
                    :selected-organization-ids="selectedOrganizationIds"
                    :show-inactive-organizations="showInactiveOrganizations" :organization-items="organizationItems"
                    :is-open="isOrganizationDropdownOpen"
                    @update:selected-organization-ids="emit('update:organizationIds', $event)"
                    @update:show-inactive-organizations="emit('update:showInactiveOrganizations', $event)"
                    @toggle="emit('toggleOrganizationDropdown')"
                    @set-dropdown-el="emit('set-organization-dropdown-el', $event)" />

                <SalaryCompositionRightActions v-if="!hasSelectedTableRows">
                </SalaryCompositionRightActions>
            </div>

            <div class="relative min-h-0 flex-1 overflow-auto">
                <SalaryCompositionTable ref="tableRef" :is-loading="isTableLoading" :rows="rows" :columns="columns"
                    @selection-count-change="selectedTableRowCount = $event" />
            </div>

            <div class="flex min-h-12.5 flex-wrap items-center justify-between gap-2 border-t 
                border-border px-4 text-[14px] text-[#001b44]">
                <div>Tổng số: <span class="font-bold">{{ totalCount }}</span></div>

                <div class="flex flex-wrap items-center gap-4">
                    <SalaryCompositionPagination @first-page="emit('firstPage')" @last-page="emit('lastPage')"
                        @next-page="emit('nextPage')" @previous-page="emit('previousPage')"
                        @update:page-size="emit('update:pageSize', $event)" :data="pagedData" :page-size="pageSize"
                        :page-size-options="pageSizeOptions" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.salary-composition-list__selection-toolbar {
    display: flex;
    min-height: 34px;
    min-width: 0;
    align-items: center;
    gap: 14px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-list__selection-count {
    white-space: nowrap;
}

.salary-composition-list__selection-count strong {
    font-weight: 700;
}

.salary-composition-list__clear-selection {
    border: 0;
    background: transparent;
    color: var(--app-color-primary);
    cursor: pointer;
    font: inherit;
    white-space: nowrap;
}

.salary-composition-list__clear-selection:hover {
    text-decoration: underline;
}

.salary-composition-list__selection-actions {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.salary-composition-list__selection-action {
    display: inline-flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid currentColor;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    padding: 0 10px;
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
    white-space: nowrap;
}

.salary-composition-list__selection-action--warning {
    color: #f58220;
}

.salary-composition-list__selection-action--warning:hover {
    background: #fff4e8;
}

.salary-composition-list__selection-action--success {
    color: var(--app-color-primary);
}

.salary-composition-list__selection-action--success:hover {
    background: #eafbf2;
}

.salary-composition-list__selection-action--danger {
    color: var(--app-color-error);
}

.salary-composition-list__selection-action--danger:hover {
    background: #fff0f0;
}

.salary-composition-list__selection-action-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
}

@media (max-width: 900px) {
    .salary-composition-list__selection-toolbar {
        align-items: flex-start;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
