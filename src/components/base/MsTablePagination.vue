<script setup lang='ts'>
import { computed } from 'vue';
import MsButton from './MsButton.vue';

interface Props {
    pageSize: number;
}

const props = defineProps<Props>();

const rangeText = computed(() => {
    return "range-text-here";
})

</script>
<template>
    <div class="flex items-center gap-2">

        <slot name="pageSizeConfig">
            <span>Số dòng/trang</span>
            <MsButton variant="secondary" class="min-w-23 justify-between font-normal">
                <span>{{ pageSize }}</span>
                <svg class="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </MsButton>
        </slot>

        <strong class="whitespace-nowrap">{{ rangeText }}</strong>

        <div class="flex items-center gap-1 text-icon">
            <MsButton variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m11 17-5-5 5-5" />
                    <path d="M18 17V7" />
                </svg>
            </MsButton>
            <MsButton variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </MsButton>
            <MsButton variant="icon" size="sm"
                class="size-8! shrink-0 border-0! bg-transparent! p-0! text-icon! hover:bg-icon-hover-bg">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </MsButton>
            <MsButton variant="icon" size="sm"
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