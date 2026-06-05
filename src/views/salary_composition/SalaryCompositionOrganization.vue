<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsTreeView from '@/components/base/MsTreeView.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import { TrackingStatus } from '@/enums/salaryCompositionEnums';

interface SalaryCompositionOrganizationFilterProps {
    organizationItems?: GetOrganizationTreeResponse[]
    isOpen?: boolean
    showInactiveOrganizations?: boolean,
    selectedOrganizationIds?: string[],
}

const props = withDefaults(defineProps<SalaryCompositionOrganizationFilterProps>(), {
    organizationItems: () => [],
    isOpen: false,
    showInactiveOrganizations: false,
    selectedOrganizationIds: () => [],
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

    props.organizationItems.forEach((organization) => {
        map.set(organization.id, organization);
    });

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
    <div :ref="setDropdownElement" class="relative min-w-65 flex-1 max-w-109.5">
        <MsButton variant="secondary" class="organization-filter-trigger w-full
         justify-between! gap-2! px-2! font-normal
             text-[13px] text-text-placeholder focus:border-primary" :aria-expanded="isOpen" aria-haspopup="tree"
            @click="emit('toggle')">
            <div class="min-w-0 flex flex-1 items-center gap-1 overflow-hidden">
                <template v-if="selectedCount > 0">
                    <span class="organization-count-chip">{{ selectedCount }}</span>

                    <span v-if="primaryOrganization" class="organization-chip">
                        <span class="truncate">{{ primaryOrganization.name }}</span>
                        <span class="organization-chip__remove" role="button" tabindex="0"
                            :aria-label="`Bỏ chọn ${primaryOrganization.name}`"
                            @click.stop="removeOrganization(primaryOrganization.id)"
                            @keydown.stop="handleRemoveKeydown($event, primaryOrganization.id)">
                            X
                        </span>
                    </span>
                </template>

                <span v-else class="truncate px-1 text-text-placeholder">Đơn vị áp dụng</span>
            </div>

            <span class="flex shrink-0 items-center gap-1 text-text-secondary">
                <span v-if="selectedCount > 0" class="organization-clear" role="button" tabindex="0"
                    aria-label="Bỏ chọn tất cả đơn vị" @click.stop="clearOrganizations"
                    @keydown.enter.stop.prevent="clearOrganizations" @keydown.space.stop.prevent="clearOrganizations">
                    <svg class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
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
            <MsTreeView @update:selected-keys="updateSelectedOrganizationIds" :selected-keys="selectedOrganizationIds"
                :items="organizationItems" key-expr="id" parent-id-expr="parentId" display-expr="name"
                class="salary-organization-tree max-h-64 overflow-auto">
                <template #item="{ item }">
                    <span class="block truncate" :class="[
                        item.hasChildren ? 'font-medium text-text-primary' : '',
                        item.trackingStatus === TrackingStatus.Inactive ? 'organization-node--inactive' : '',
                    ]">
                        {{ item.name }}
                    </span>
                </template>
            </MsTreeView>

            <label class="flex min-h-10 items-center gap-3 border-t border-[#d7f1e3] bg-[#eafaef]
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
    background: #f8fafc;
    color: #001b44;
    font-weight: 600;
    line-height: 1;
}

.organization-chip {
    min-width: 0;
    max-width: min(260px, 100%);
    justify-content: flex-start;
    gap: 6px;
    padding: 0 8px 0 10px;
    background: #ffffff;
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

.salary-organization-tree :deep(.dx-treeview-node-container) {
    padding: 0;
}

.salary-organization-tree :deep(.dx-treeview-item) {
    min-height: 38px;
    padding-block: 0;
    color: var(--app-color-text-primary);
}

.salary-organization-tree :deep(.dx-treeview-item-with-checkbox .dx-treeview-item) {
    padding-left: 0;
}

.salary-organization-tree :deep(.dx-treeview-node.dx-state-selected > .dx-treeview-item) {
    background-color: var(--app-color-focus);
}

.salary-organization-tree :deep(.dx-treeview-node.dx-state-hover:not(.dx-state-selected) > .dx-treeview-item) {
    background-color: #f8f9fb;
}

.salary-organization-tree :deep(.dx-treeview-node.dx-state-selected.dx-state-hover > .dx-treeview-item) {
    background-color: #cdeadf;
}
</style>
