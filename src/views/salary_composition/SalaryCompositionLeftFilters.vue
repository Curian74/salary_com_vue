<script setup lang="ts">
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';
import SalaryCompositionStatusFilter from './SalaryCompositionStatusFilter.vue';
import SalaryCompositionOrganizationFilter from './SalaryCompositionOrganizationFilter.vue';
import type { MsMenuOption } from '@/components/base/MsMenu.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';

interface SalaryCompositionLeftFiltersProps {
    status?: string | number | null
    statusOptions?: MsMenuOption[]
    organizationItems?: GetOrganizationTreeResponse[]
    isOrganizationDropdownOpen?: boolean
    showInactiveOrganizations?: boolean
    selectedOrganizationIds?: string[]
}

withDefaults(defineProps<SalaryCompositionLeftFiltersProps>(), {
    status: null,
    statusOptions: () => [],
    organizationItems: () => [],
    isOrganizationDropdownOpen: false,
    showInactiveOrganizations: false,
    selectedOrganizationIds: () => [],
});

const emit = defineEmits<{
    search: [value: string]
    'update:status': [value: string | number | null]
    'update:showInactiveOrganizations': [value: boolean]
    'toggle-organization-dropdown': []
    'set-organization-dropdown-el': [element: HTMLElement | null],
    'update:selectedOrganizationIds': [string[]]
}>();
</script>

<template>
    <SalaryCompositionSearch @search="value => emit('search', value)" />

    <SalaryCompositionStatusFilter :status="status" :status-options="statusOptions"
        @update:status="value => emit('update:status', value)" />

    <SalaryCompositionOrganizationFilter :organization-items="organizationItems" :is-open="isOrganizationDropdownOpen"
        :show-inactive-organizations="showInactiveOrganizations" :selected-organization-ids="selectedOrganizationIds"
        @update:show-inactive-organizations="value => emit('update:showInactiveOrganizations', value)"
        @update:selected-organization-ids="value => emit('update:selectedOrganizationIds', value)"
        @toggle="emit('toggle-organization-dropdown')"
        @set-dropdown-el="element => emit('set-organization-dropdown-el', element)" />
</template>
