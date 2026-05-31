<script setup lang="ts">
import SalaryCompositionButtons from './SalaryCompositionButtons.vue';
import SalaryCompositionTable from './SalaryCompositionTable.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import { computed, onMounted, ref, watch } from 'vue';
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

const columns = ref<GetGridConfigsResponse[]>([]);
const isTableLoading = ref(false);
const selectedStatus = ref<TrackingStatus | null>(null);
const trackingStatusOptions = ref<LookupResponse[]>([]);

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: 1,
    pageSize: 2,
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

const pagedData = computed(() => {
    return salaryCompositions.value;
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
                <SalaryCompositionLeftFilters :status="selectedStatus" :status-options="statusMenuOptions"
                    @update:status="handleStatusChange" @search="handleSearch" />
                <SalaryCompositionRightActions />
            </div>

            <div class="relative min-h-0 flex-1 overflow-auto">
                <SalaryCompositionTable :is-loading="isTableLoading" :rows="rows" :columns="columns" />
            </div>

            <div class="flex min-h-12.5 flex-wrap items-center justify-between gap-2 border-t 
                border-border px-4 text-[14px] text-[#001b44]">
                <div>Tổng số: <span class="font-bold">{{ totalCount }}</span></div>

                <div class="flex flex-wrap items-center gap-4">
                    <SalaryCompositionPagination @first-page="handleFirstPage" @last-page="handleLastPage"
                        @next-page="handleNextPage" @previous-page="handlePreviousPage" :data="pagedData" />
                </div>
            </div>
        </div>
    </section>
</template>
