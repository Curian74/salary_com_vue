<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsTreeView from '@/components/base/tree_view/MsTreeView.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import { TrackingStatus } from '@/enums/salaryCompositionEnums';
import MsIcon from '@/components/base/MsIcon.vue';

interface SalaryCompositionOrganizationFilterProps {
    organizationItems?: GetOrganizationTreeResponse[]
    isOpen?: boolean
    showInactiveOrganizations?: boolean,
    selectedOrganizationIds?: string[],
    invalid?: boolean,
    showUnfollowedOrgs?: boolean,
}

const props = withDefaults(defineProps<SalaryCompositionOrganizationFilterProps>(), {
    organizationItems: () => [],
    isOpen: false,
    showInactiveOrganizations: false,
    selectedOrganizationIds: () => [],
    invalid: false,
});

const emit = defineEmits<{
    'update:showInactiveOrganizations': [value: boolean]
    toggle: []
    'set-dropdown-el': [element: HTMLElement | null],
    'update:selectedOrganizationIds': [string[]]
}>();

const treeViewRef = ref<any>(null);

const setDropdownElement = (element: Element | ComponentPublicInstance | null) => {
    emit('set-dropdown-el', element instanceof HTMLElement ? element : null);
};

const organizationById = computed(() => {
    const map = new Map<string, GetOrganizationTreeResponse>();

    function traverse(items: GetOrganizationTreeResponse[]) {
        items.forEach((organization) => {
            map.set(organization.id, organization);
            traverse(organization.children ?? []);
        });
    }

    traverse(props.organizationItems);

    return map;
});

const selectedOrganizations = computed(() =>
    props.selectedOrganizationIds
        .map((id) => organizationById.value.get(id))
        .filter((organization) => Boolean(organization))
);

const selectedCount = computed(() => props.selectedOrganizationIds.length);
const primaryOrganization = computed(() =>
    selectedOrganizations.value[selectedOrganizations.value.length - 1]
    ?? null);

const updateSelectedOrganizationIds = (ids: string[]) => {
    emit('update:selectedOrganizationIds', ids);
};

const removeOrganization = (id: string) => {
    updateSelectedOrganizationIds(props.selectedOrganizationIds.filter((selectedId) => selectedId !== id));
};

const clearOrganizations = () => {
    const treeInstance = treeViewRef.value?.instance;
    if (treeInstance) {
        treeInstance.unselectAll();   // Clears all checked nodes
        treeInstance.collapseAll();   // Collapses all expanded nodes
    }
    updateSelectedOrganizationIds([]);
};

const handleRemoveKeydown = (event: KeyboardEvent, id: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    removeOrganization(id);
}

</script>

<template>
    <div :ref="setDropdownElement" class="relative flex-1 max-w-109.5">
        <MsButton variant="secondary" class="organization-filter-trigger w-full
         justify-between! gap-2! px-2! font-normal
             text-[13px] text-text-placeholder focus:border-primary"
            :class="{ 'organization-filter-trigger--invalid': invalid }" :aria-expanded="isOpen" :aria-invalid="invalid"
            aria-haspopup="tree" @click="emit('toggle')">
            <div class="min-w-0 flex flex-1 items-center gap-1 overflow-hidden">
                <template v-if="selectedCount > 0">
                    <span v-if="selectedCount > 1" class="organization-count-chip">{{ selectedCount }}</span>

                    <span v-if="primaryOrganization" class="organization-chip">
                        <span class="truncate">{{ primaryOrganization.name }}</span>
                        <span class="organization-chip__remove" role="button"
                            @click.stop="removeOrganization(primaryOrganization.id)"
                            @keydown.stop="handleRemoveKeydown($event, primaryOrganization.id)">
                            <MsIcon name="x"></MsIcon>
                        </span>
                    </span>
                </template>

                <span v-else class="truncate px-1 text-text-placeholder text-[13px]">Tất cả đơn vị</span>
            </div>

            <span class="flex shrink-0 items-center gap-1 text-text-secondary">
                <span v-if="selectedCount > 0" class="organization-clear" role="button" tabindex="0"
                    aria-label="Bỏ chọn tất cả đơn vị" @click.stop="clearOrganizations"
                    @keydown.enter.stop.prevent="clearOrganizations" @keydown.space.stop.prevent="clearOrganizations">
                    <MsIcon name="x"></MsIcon>
                </span>

                <svg class="size-4 transition-transform" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
        </MsButton>

        <div v-if="isOpen" class="absolute left-0 top-full z-10000 mt-1 w-full overflow-hidden
             rounded-lg border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
            <MsTreeView ref="treeViewRef" @update:selected-keys="updateSelectedOrganizationIds"
                :selected-keys="selectedOrganizationIds" :items="organizationItems" key-expr="id"
                parent-id-expr="parentId" display-expr="name" class="salary-organization-tree max-h-64 overflow-auto">
                <template #item="{ item }">
                    <span class="block truncate" :class="[
                        item.hasChildren ? 'font-medium text-text-primary' : '',
                        item.trackingStatus === TrackingStatus.Inactive ? 'organization-node--inactive' : '',
                    ]">
                        {{ item.name }}
                    </span>
                </template>
            </MsTreeView>

            <label v-if="showUnfollowedOrgs" class="flex min-h-10 items-center gap-3 border-t
             border-[#d7f1e3] bg-[#eafaef]
                 px-5 text-[13px] text-text-primary">
                <MsCheckbox :checked="showInactiveOrganizations"
                    @change="checked => emit('update:showInactiveOrganizations', checked)" />
                <span class="truncate">Hiển thị đơn vị ngừng theo dõi</span>
            </label>
        </div>
    </div>
</template>

<style scoped>
.organization-filter-trigger {
    min-height: 36px;
}

.organization-filter-trigger--invalid,
.organization-filter-trigger--invalid:hover,
.organization-filter-trigger--invalid:focus {
    border-color: var(--app-color-error);
}

.organization-filter-trigger--invalid:focus {
    box-shadow: 0 0 0 2px rgba(229, 72, 72, 0.12);
}

.organization-count-chip,
.organization-chip {
    display: inline-flex;
    height: 28px;
    min-width: 28px;
    max-width: 100%;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 1px solid #d7dce1;
    border-radius: 8px;
    background: #F5F5F5;
    color: #001b44;
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
}

.organization-chip {
    min-width: 0;
    max-width: min(260px, 100%);
    justify-content: flex-start;
    gap: 6px;
    padding: 0 8px 0 10px;
    background: #F5F5F5;
    font-size: 13px;
    font-weight: 500;
}

.organization-chip__remove,
.organization-clear {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: #5f6673;
    cursor: pointer;
}

.organization-chip__remove:hover,
.organization-clear:hover {
    color: #001b44;
}

.organization-clear {
    width: 24px;
    height: 24px;
    border-radius: 4px;
}

.organization-clear:hover {
    background: #f1f3f5;
}

.organization-node--inactive {
    color: #9aa0a6;
}

.salary-organization-tree :deep(.ms-tree-node__row) {
    min-height: 38px;
}
</style>
