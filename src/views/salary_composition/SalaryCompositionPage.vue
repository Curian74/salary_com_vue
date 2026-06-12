<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import gridConfigApi from '@/apis/gridConfigApi';
import lookupApi from '@/apis/lookupApi.ts';
import organizationApi from '@/apis/organizationApi.ts';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import MsButton from '@/components/base/MsButton.vue';
import type { MsMenuOption } from '@/components/base/MsMenu.vue';
import MsPopup from '@/components/base/MsPopup.vue';
import type { MsSelectOption } from '@/components/base/MsSelect.vue';
import { trackingStatusLabels } from '@/constants/trackingStatusLabels.ts';
import gridKeys from '@/constants/gridKeys.ts';
import localStorageKeys from '@/constants/localStorageKeys.ts';
import { TrackingStatus } from '@/enums/salaryCompositionEnums';
import type { LookupResponse, PagedResult } from '@/types/apiResponse.ts';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import type { GetOrganizationTreeRequest, GetOrganizationTreeResponse } from '@/types/organization.ts';
import type { DeleteRequest, GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import SalaryCompositionAdd from './SalaryCompositionAdd.vue';
import SalaryCompositionDetails from './SalaryCompositionDetails.vue';
import SalaryCompositionList from './SalaryCompositionList.vue';
import type { SalaryCompositionRowActionKey } from './SalaryCompositionTable.vue';
import { toast } from 'vue3-toastify';

type SalaryCompositionView = 'list' | 'add' | 'edit' | 'view';

interface UpdateStatusManyPayload {
    ids: string[];
    status: TrackingStatus;
}

interface SalaryCompositionRowActionPayload {
    action: SalaryCompositionRowActionKey;
    row: GetSalaryCompositionsResponse;
}

const activeView = ref<SalaryCompositionView>('list');
const selectedSalaryCompositionId = ref<string | null>(null);
const salaryCompositionListRef = ref<InstanceType<typeof SalaryCompositionList> | null>(null);
const pendingStatusPayload = ref<UpdateStatusManyPayload | null>(null);
const pendingDeleteIds = ref<string[]>([]);

const columns = ref<GetGridConfigsResponse[]>([]);
const isTableLoading = ref(false);
const selectedStatus = ref<TrackingStatus | null>(null);
const trackingStatusOptions = ref<LookupResponse[]>([]);
const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);
const organizationQueryObject = ref<GetOrganizationTreeRequest>({
    trackingStatus: TrackingStatus.Active,
});
const organizationTreeItems = ref<GetOrganizationTreeResponse[]>();

const pageSize = Number(localStorage.getItem(localStorageKeys.PAGE_SIZE_KEY)) || 15;

const queryObject = ref<GetSalaryCompositionsRequest>({
    pageIndex: 1,
    pageSize,
    searchTerm: '',
    organizationIds: null,
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

const pageSizeOptions: MsSelectOption[] = [
    { value: 15, label: '15' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

const rows = computed(() => salaryCompositions.value.items);
const totalCount = computed(() => salaryCompositions.value.totalCount);
const pagedData = computed(() => salaryCompositions.value);
const isShowInactiveOrganizations = computed(() => organizationQueryObject.value.trackingStatus === undefined);
const isStatusConfirmOpen = computed(() => pendingStatusPayload.value !== null);
const isDeleteConfirmOpen = computed(() => pendingDeleteIds.value.length > 0);
const pendingStatusLabel = computed(() =>
    pendingStatusPayload.value?.status === TrackingStatus.Active ? 'đang theo dõi' : 'ngừng theo dõi',
);

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

const closeOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = false;
};

const toggleOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = !isOrganizationDropdownOpen.value;
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

const handlePreviousPage = () => {
    if (salaryCompositions.value.hasPreviousPage) {
        queryObject.value.pageIndex--;
    }
};

const handleNextPage = () => {
    if (salaryCompositions.value.hasNextPage) {
        queryObject.value.pageIndex++;
    }
};

const handleFirstPage = () => {
    queryObject.value.pageIndex = 1;
};

const handleLastPage = () => {
    queryObject.value.pageIndex = salaryCompositions.value.totalPages;
};

const handleSearch = (searchTerm: string) => {
    queryObject.value.pageIndex = 1;
    queryObject.value.searchTerm = searchTerm;
};

const handleStatusChange = (status: string | number | null) => {
    selectedStatus.value = typeof status === 'number' ? status : null;
    queryObject.value.pageIndex = 1;
    queryObject.value.trackingStatus = selectedStatus.value;
};

const handleUpdateStatusMany = (payload: UpdateStatusManyPayload) => {
    if (payload.ids.length === 0) return;

    pendingStatusPayload.value = payload;
};

const closeStatusConfirm = () => {
    pendingStatusPayload.value = null;
};

const confirmUpdateStatusMany = async () => {
    if (!pendingStatusPayload.value) return;

    try {
        isTableLoading.value = true;

        // Gọi batch API với danh sách id lấy từ các row đang chọn.
        await salaryCompositionApi.updateStatus({
            salaryCompositionIds: pendingStatusPayload.value.ids,
            status: pendingStatusPayload.value.status,
        });
        toast('Cập nhật thành công', {
            theme: 'colored',
            type: 'success',
        });
        await fetchSalaryCompositions();
        salaryCompositionListRef.value?.clearTableSelection();
        closeStatusConfirm();
    }
    catch (err) {
        toast('Cập nhật thất bại', {
            theme: 'colored',
            type: 'error',
        });
    }
    finally {
        isTableLoading.value = false;
    }
};

const handleDeleteMany = (ids: string[]) => {
    if (ids.length === 0) return;

    pendingDeleteIds.value = ids;
};

const closeDeleteConfirm = () => {
    pendingDeleteIds.value = [];
};

const confirmDeleteMany = async () => {
    if (pendingDeleteIds.value.length === 0) return;

    const request: DeleteRequest = {
        salaryCompositionIds: pendingDeleteIds.value,
    }

    try {
        isTableLoading.value = true;

        await salaryCompositionApi.deleteMany(request);

        toast('Xóa thành công', {
            theme: 'colored',
            type: 'success',
        });

        await fetchSalaryCompositions();
        salaryCompositionListRef.value?.clearTableSelection();
        closeDeleteConfirm();
    }

    catch (err) {
        toast('Xóa thất bại', {
            theme: 'colored',
            type: 'error',
        });
    }

    finally {
        isTableLoading.value = false;
    }
};

const handleOrganizationIdsChange = (organizationIds: string[]) => {
    queryObject.value.pageIndex = 1;
    queryObject.value.organizationIds = organizationIds.length > 0 ? organizationIds : null;
};

const handlePageSizeChange = (nextPageSize: number) => {
    queryObject.value.pageIndex = 1;
    localStorage.setItem(localStorageKeys.PAGE_SIZE_KEY, nextPageSize.toString());
    queryObject.value.pageSize = nextPageSize;
};

const handleShowAllOrganization = () => {
    organizationQueryObject.value.trackingStatus =
        organizationQueryObject.value.trackingStatus === TrackingStatus.Active
            ? undefined
            : TrackingStatus.Active;
};

const showList = () => {
    activeView.value = 'list';
    selectedSalaryCompositionId.value = null;
};

const showAdd = () => {
    closeOrganizationDropdown();
    activeView.value = 'add';
    selectedSalaryCompositionId.value = null;
};

const showEdit = (id: string) => {
    closeOrganizationDropdown();
    activeView.value = 'edit';
    selectedSalaryCompositionId.value = id;
};

const showView = (id: string) => {
    closeOrganizationDropdown();
    activeView.value = 'view';
    selectedSalaryCompositionId.value = id;
};

const handleRowAction = (payload: SalaryCompositionRowActionPayload) => {
    switch (payload.action) {
        case 'view':
            showView(payload.row.id);
            break;
        case 'edit':
            showEdit(payload.row.id);
            break;
        case 'delete':
            handleDeleteMany([payload.row.id]);
            break;
        case 'activate':
            handleUpdateStatusMany({
                ids: [payload.row.id],
                status: TrackingStatus.Active,
            });
            break;
        case 'deactivate':
            handleUpdateStatusMany({
                ids: [payload.row.id],
                status: TrackingStatus.Inactive,
            });
            break;
    }
};

const handleSaved = async () => {
    showList();
    await fetchSalaryCompositions();
};

const fetchTrackingStatuses = async () => {
    try {
        const response = await lookupApi.getTrackingStatuses();
        trackingStatusOptions.value = response.value;
    }
    catch (err) {
        console.log(err);
        trackingStatusOptions.value = [];
    }
};

const fetchOrganizationTree = async () => {
    try {
        const response = await organizationApi.fetchOrganizationTree(organizationQueryObject.value);
        organizationTreeItems.value = response.value;
    }
    catch (err) {
        console.log(err);
        organizationTreeItems.value = [];
    }
};

async function fetchSalaryCompositions() {
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
        queryObject.value.organizationIds,
    ],
    fetchSalaryCompositions,
);

watch(
    () => organizationQueryObject.value.trackingStatus,
    fetchOrganizationTree,
);

onMounted(async () => {
    try {
        isTableLoading.value = true;

        const gridData = await gridConfigApi.fetchGridConfigs(gridKeys.SALARY_COMPOSITION);
        columns.value = gridData.value;

        await fetchTrackingStatuses();
        await fetchSalaryCompositions();
        await fetchOrganizationTree();

        document.addEventListener('pointerdown', handleDocumentPointerDown);
        document.addEventListener('keydown', handleDocumentKeydown);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        isTableLoading.value = false;
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>

<template>
    <SalaryCompositionList v-if="activeView === 'list'" ref="salaryCompositionListRef" :columns="columns"
        :is-table-loading="isTableLoading" :rows="rows" :selected-status="selectedStatus"
        :status-menu-options="statusMenuOptions" :selected-organization-ids="queryObject.organizationIds ?? []"
        :show-inactive-organizations="isShowInactiveOrganizations" :organization-items="organizationTreeItems"
        :is-organization-dropdown-open="isOrganizationDropdownOpen" :total-count="totalCount" :paged-data="pagedData"
        :page-size="queryObject.pageSize" :page-size-options="pageSizeOptions" @add="showAdd" @search="handleSearch"
        @update:status="handleStatusChange" @update:organization-ids="handleOrganizationIdsChange"
        @update:show-inactive-organizations="handleShowAllOrganization"
        @toggle-organization-dropdown="toggleOrganizationDropdown"
        @set-organization-dropdown-el="setOrganizationDropdownElement" @first-page="handleFirstPage"
        @last-page="handleLastPage" @next-page="handleNextPage" @previous-page="handlePreviousPage"
        @update:page-size="handlePageSizeChange" @update-status-many="handleUpdateStatusMany"
        @delete-many="handleDeleteMany" @row-action="handleRowAction" />

    <SalaryCompositionAdd v-else-if="activeView === 'add'" :organization-items="organizationTreeItems" @back="showList"
        @saved="handleSaved" />

    <SalaryCompositionDetails :salary-composition-id="selectedSalaryCompositionId"
        v-else-if="activeView === 'view' || activeView === 'edit'" />

    <MsPopup :open="isStatusConfirmOpen" width="420px" @close="closeStatusConfirm">
        <template #title>Chuyển trạng thái</template>

        <p class="text-[13px] leading-4.5">
            Bạn có chắc chắn muốn chuyển trạng thái thành phần lương đã chọn sang {{ pendingStatusLabel }} không?
        </p>

        <template #footer>
            <MsButton size="sm" variant="secondary" class="min-w-20 font-medium" :disabled="isTableLoading"
                @click="closeStatusConfirm">
                Hủy bỏ
            </MsButton>
            <MsButton size="sm" variant="primary" class="min-w-20 font-medium" :loading="isTableLoading"
                @click="confirmUpdateStatusMany">
                Đồng ý
            </MsButton>

        </template>
    </MsPopup>

    <MsPopup :open="isDeleteConfirmOpen" width="420px" @close="closeDeleteConfirm">
        <template #title>Thông báo</template>

        <p class="text-[13px] leading-4.5">
            Bạn có chắc chắn muốn xóa thành phần lương đã chọn không?
        </p>

        <template #footer>
            <MsButton size="sm" variant="secondary" class="min-w-20 font-medium" :disabled="isTableLoading"
                @click="closeDeleteConfirm">
                Hủy
            </MsButton>
            <MsButton size="sm" variant="primary" class="min-w-20 bg-[#f04438]! font-medium hover:bg-[#d92d20]!"
                :loading="isTableLoading" @click="confirmDeleteMany">
                Xóa
            </MsButton>
        </template>
    </MsPopup>
</template>
