<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsMenu, { type MsMenuOption } from '@/components/base/MsMenu.vue';
import MsTreeView from '@/components/base/MsTreeView.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';

interface SalaryCompositionLeftFiltersProps {
    status?: string | number | null
    statusOptions?: MsMenuOption[]
    organizationItems?: Record<string, any>[]
    isOrganizationDropdownOpen?: boolean
    showInactiveOrganizations?: boolean
}

const props = withDefaults(defineProps<SalaryCompositionLeftFiltersProps>(), {
    status: null,
    statusOptions: () => [],
    organizationItems: () => [],
    isOrganizationDropdownOpen: false,
    showInactiveOrganizations: false,
});

const emit = defineEmits<{
    search: [value: string]
    'update:status': [value: string | number | null]
    'update:showInactiveOrganizations': [value: boolean]
    'toggle-organization-dropdown': []
    'set-organization-dropdown-el': [element: HTMLElement | null]
}>();

const selectedStatus = computed({
    get: () => props.status,
    set: (value) => emit('update:status', value),
});

const selectedStatusLabel = computed(() => {
    const selectedOption = props.statusOptions.find((option) => option.value === props.status);

    return selectedOption?.label ?? selectedOption?.name ?? 'Tất cả';
});

const handleSearch = (value: string) => {
    emit('search', value);
};

const setOrganizationDropdownElement = (element: Element | ComponentPublicInstance | null) => {
    emit('set-organization-dropdown-el', element instanceof HTMLElement ? element : null);
};
</script>

<template>
    <SalaryCompositionSearch @search="handleSearch" />

    <MsMenu v-model="selectedStatus" :options="statusOptions">
        <template #trigger="{ open, isOpen }">
            <MsButton variant="secondary" class="font-normal text-[13px] text-text-secondary!" :aria-expanded="isOpen"
                aria-haspopup="menu" @click="open">
                <span class="text-[13px]">
                    Trạng thái:
                    <span class="text-[13px] font-semibold text-text-primary">
                        {{ selectedStatusLabel }}
                    </span>
                </span>
                <svg class="size-4 transition-transform" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </MsButton>
        </template>
    </MsMenu>

    <div :ref="setOrganizationDropdownElement" class="relative min-w-65 flex-1 max-w-109.5">
        <MsButton variant="secondary"
            class="w-full justify-between! font-normal text-[13px] text-text-placeholder focus:border-primary"
            :aria-expanded="isOrganizationDropdownOpen" aria-haspopup="tree"
            @click="emit('toggle-organization-dropdown')">
            <span>Tất cả đơn vị</span>
            <svg class="size-4 text-text-secondary transition-transform"
                :class="isOrganizationDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </MsButton>

        <div v-if="isOrganizationDropdownOpen" class="absolute left-0 top-full z-10000 mt-1 w-full overflow-hidden
             rounded-lg border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
            <MsTreeView :items="organizationItems" key-expr="id" parent-id-expr="parentId" display-expr="name"
                class="salary-organization-tree max-h-64 overflow-auto">
                <template #item="{ item }">
                    <span class="block truncate" :class="item.level <= 1 ? 'font-semibold text-text-primary' : ''">
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

.salary-organization-tree :deep(.dx-treeview-node.dx-state-hover > .dx-treeview-item) {
    background-color: #f8f9fb;
}
</style>
