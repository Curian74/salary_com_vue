<script setup lang='ts' generic="T">
import { computed } from 'vue';
import MsButton from './MsButton.vue';
import type { PagedResult } from '@/types/apiResponse.ts';

interface Props {
    data: PagedResult<T>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    previousPage: [],
    nextPage: [],
    firstPage: [],
    lastPage: [],
}>();

const handlePreviousPage = () => {
    emit('previousPage');
}

const handleNextPage = () => {
    emit('nextPage');
}

const handleFirstPage = () => {
    emit('firstPage');
}

const handleLastPage = () => {
    emit('lastPage');
}

const rangeText = computed(() => {
    if (!props.data.totalCount) {
        return '0 - 0';
    }
    const start = (props.data.pageIndex - 1) * props.data.pageSize + 1;
    const end = Math.min(props.data.pageIndex * props.data.pageSize, props.data.totalCount);

    return `${start} - ${end}`;
})

</script>
<template>
    <div class="flex items-center gap-2">

        <slot name="pageSizeConfig">
            <span>Số dòng/trang</span>
            <MsButton variant="secondary" class="min-w-23 justify-between font-normal">
                <span>{{ data.pageSize }}</span>
                <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </MsButton>
        </slot>

        <strong class="whitespace-nowrap">{{ rangeText }}</strong>

        <div class="flex items-center gap-1 text-icon">
            <MsButton :disabled="!data.hasPreviousPage" @click="handleFirstPage" variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m11 17-5-5 5-5" />
                    <path d="M18 17V7" />
                </svg>
            </MsButton>
            <MsButton @click="handlePreviousPage" :disabled="!data.hasPreviousPage" variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </MsButton>
            <MsButton @click="handleNextPage" :disabled="!data.hasNextPage" variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </MsButton>
            <MsButton :disabled="!data.hasNextPage" @click="handleLastPage" variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m13 17 5-5-5-5" />
                    <path d="M6 17V7" />
                </svg>
            </MsButton>
        </div>

    </div>
</template>
<style scoped></style>
