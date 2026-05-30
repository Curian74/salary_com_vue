<script setup lang='ts'>
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionSearch from './SalaryCompositionSearch.vue';

const emit = defineEmits<{
    search: [value: string]
}>();

const handleSearch = (value: string) => {
    emit('search', value);
};

</script>
<template>
    <SalaryCompositionSearch @search="handleSearch" />

    <MsButton variant="secondary" class="font-normal text-[13px] text-text-secondary!">
        <span>Trạng thái: <span class="font-semibold text-text-primary">Tất cả</span></span>
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    </MsButton>

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