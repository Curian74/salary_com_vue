<script setup lang="ts">
import { computed } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsMenu, { type MsMenuOption } from '@/components/base/MsMenu.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';

interface SalaryCompositionLeftFiltersProps {
    status?: string | number | null
    statusOptions?: MsMenuOption[]
}

const props = withDefaults(defineProps<SalaryCompositionLeftFiltersProps>(), {
    status: null,
    statusOptions: () => [],
});

const emit = defineEmits<{
    search: [value: string]
    'update:status': [value: string | number | null]
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

    <MsButton variant="secondary"
        class="min-w-65 flex-1 max-w-109.5 justify-between! font-normal text-[13px] text-text-placeholder">
        <span>Tất cả đơn vị</span>
        <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    </MsButton>
</template>

<style scoped></style>
