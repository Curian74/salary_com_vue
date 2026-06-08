<script setup lang="ts">
import type { MsMenuOption } from '@/components/base/MsMenu.vue';
import type { MsSelectOption } from '@/components/base/MsSelect.vue';
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

                <SalaryCompositionStatusFilter :status="selectedStatus" :status-options="statusMenuOptions"
                    @update:status="emit('update:status', $event)" />

                <SalaryCompositionOrganization :selected-organization-ids="selectedOrganizationIds"
                    :show-inactive-organizations="showInactiveOrganizations" :organization-items="organizationItems"
                    :is-open="isOrganizationDropdownOpen"
                    @update:selected-organization-ids="emit('update:organizationIds', $event)"
                    @update:show-inactive-organizations="emit('update:showInactiveOrganizations', $event)"
                    @toggle="emit('toggleOrganizationDropdown')"
                    @set-dropdown-el="emit('set-organization-dropdown-el', $event)" />

                <SalaryCompositionRightActions>
                </SalaryCompositionRightActions>
            </div>

            <div class="relative min-h-0 flex-1 overflow-auto">
                <SalaryCompositionTable :is-loading="isTableLoading" :rows="rows" :columns="columns" />
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
