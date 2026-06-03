<script setup lang="ts">
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import gridConfigApi from '@/apis/gridConfigApi';
import lookupApi from '@/apis/lookupApi.ts';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import SalaryCompositionLeftFilters from './SalaryCompositionLeftFilters.vue';
import SalaryCompositionRightActions from './SalaryCompositionRightActions.vue';
import gridKeys from '@/constants/gridKeys.ts';
import SalaryCompositionPagination from './SalaryCompositionPagination.vue';
import { TrackingStatus } from '@/enums/salaryCompositionEnums';
import type { LookupResponse, PagedResult } from '@/types/apiResponse.ts';
import type { MsMenuOption } from '@/components/base/MsMenu.vue';
import { trackingStatusLabels } from '@/constants/trackingStatusLabels.ts';
import localStorageKeys from '@/constants/localStorageKeys.ts';
import type { GetOrganizationTreeRequest, GetOrganizationTreeResponse } from '@/types/organization.ts';
import organizationApi from '@/apis/organizationApi.ts';

const columns = ref<GetGridConfigsResponse[]>([]);
const isTableLoading = ref(false);
const selectedStatus = ref<TrackingStatus | null>(null);
const trackingStatusOptions = ref<LookupResponse[]>([]);

const pageSize = Number(localStorage.getItem(localStorageKeys.PAGE_SIZE_KEY)) || 15;

interface OrganizationTreeItem {
    id: string
    parentId?: string
    name: string
    level: number
    expanded?: boolean
}

const toggleOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = !isOrganizationDropdownOpen.value;
};

const closeOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = false;
};

const setOrganizationDropdownElement = (element: HTMLElement | null) => {
    organizationDropdownRef.value = element;
};

const handleDocumentPointerDown = (event: PointerEvent) => {
    if (!isOrganizationDropdownOpen.value) {
        return;
    }

    const target = event.target as Node | null;

    if (target && organizationDropdownRef.value?.contains(target)) {
        return;
    }

    closeOrganizationDropdown();
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeOrganizationDropdown();
    }
};

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});

const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);
const organizationQueryObject = ref<GetOrganizationTreeRequest>({
    trackingStatus: TrackingStatus.Active,
});
const organizationTreeItems = ref<GetOrganizationTreeResponse[]>();

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: 1,
    pageSize,
    searchTerm: '',
});

const salaryCompositions = ref<PagedResult<GetSalaryCompositionsResponse>>({
    items: [],
    totalCount: 0,
    pageSize: queryObject.value.pageSize,
    pageIndex: queryObject.value.pageIndex,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
});

const pageSizeOptions = [
    { value: 15, label: '15' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
]

const rows = computed(() => {
    return salaryCompositions.value.items;
});

const totalCount = computed(() => salaryCompositions.value.totalCount);

const statusMenuOptions = computed<MsMenuOption[]>(() => [
    {
        label: 'Tất cả',
        value: null,
    },
    ...trackingStatusOptions.value.map((option) => ({
        ...option,
        label: trackingStatusLabels[option.value] ?? option.name,
    })),
]);

const handlePreviousPage = () => {
    if (salaryCompositions.value.hasPreviousPage) {
        queryObject.value.pageIndex--;
    }
}

const handleNextPage = () => {
    if (salaryCompositions.value.hasNextPage) {
        queryObject.value.pageIndex++;
    }
}

const handleFirstPage = () => {
    queryObject.value.pageIndex = 1;
}

const handleLastPage = () => {
    queryObject.value.pageIndex = salaryCompositions.value.totalPages;
}

const handleSearch = (searchTerm: string) => {
    queryObject.value.pageIndex = 1;
    queryObject.value.searchTerm = searchTerm
}

const handleStatusChange = (status: string | number | null) => {
    selectedStatus.value = typeof status === 'number' ? status : null;
    queryObject.value.pageIndex = 1;
    queryObject.value.trackingStatus = selectedStatus.value;
}

const handlePageSizeChange = (pageSize: number) => {
    queryObject.value.pageIndex = 1;
    const pageSizeString = pageSize.toString();
    localStorage.setItem(localStorageKeys.PAGE_SIZE_KEY, pageSizeString);
    queryObject.value.pageSize = pageSize;
}

const pagedData = computed(() => {
    return salaryCompositions.value;
})

const isShowInactiveOrganizations = computed(() => {
    return organizationQueryObject.value.trackingStatus === TrackingStatus.Active;
})

const fetchTrackingStatuses = async () => {
    try {
        const response = await lookupApi.getTrackingStatuses();

        trackingStatusOptions.value = response.value;
    }
    catch (err) {
        console.log(err);
        trackingStatusOptions.value = [];
    }
}

const fetchOrganizationTree = async () => {
    try {
        const response = await organizationApi.fetchOrganizationTree(organizationQueryObject.value);
        organizationTreeItems.value = response.value
    }
    catch (err) {
        console.log(err);
        organizationTreeItems.value = [];
    }
}

const fetchSalaryCompositions = async () => {
    try {
        isTableLoading.value = true;

        const salData = await salaryCompositionApi.fetchSalaryCompositions(queryObject.value);

        salaryCompositions.value = salData.value;
    }
    catch (err) {
        console.log(err);
    }

    finally {
        isTableLoading.value = false;
    }
}

watch(
    () => [
        queryObject.value.pageIndex,
        queryObject.value.pageSize,
        queryObject.value.searchTerm,
        queryObject.value.trackingStatus,
    ],
    fetchSalaryCompositions
);

onMounted(async () => {
    try {
        isTableLoading.value = true;

        const gridData = await gridConfigApi.fetchGridConfigs(gridKeys.SALARY_COMPOSITION);
        columns.value = gridData.value;

        await fetchTrackingStatuses();
        await fetchSalaryCompositions();
        await fetchOrganizationTree();
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
                <SalaryCompositionLeftFilters :organization-items="organizationTreeItems"
                    :is-organization-dropdown-open="isOrganizationDropdownOpen"
                    v-model:show-inactive-organizations="isShowInactiveOrganizations" :status="selectedStatus"
                    :status-options="statusMenuOptions" @toggle-organization-dropdown="toggleOrganizationDropdown"
                    @set-organization-dropdown-el="setOrganizationDropdownElement" @update:status="handleStatusChange"
                    @search="handleSearch">
                </SalaryCompositionLeftFilters>

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
                    <SalaryCompositionPagination @first-page="handleFirstPage" @last-page="handleLastPage"
                        @next-page="handleNextPage" @previous-page="handlePreviousPage"
                        @update:page-size="handlePageSizeChange" :data="pagedData" :page-size="queryObject.pageSize"
                        :page-size-options="pageSizeOptions" />
                </div>
            </div>
        </div>
    </section>
</template>
