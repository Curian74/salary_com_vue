<script setup lang='ts'>
import MsInput from '@/components/base/MsInput.vue';

</script>
<template>
    <label class="relative h-9 min-w-60 flex-1 max-w-94">
        <span class="sr-only">Tìm kiếm</span>
        <svg class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7a828c]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
        <MsInput
        placeholder="Tìm kiếm"
        class="h-full w-full rounded-lg border border-[#d7dce1]
        pl-10 pr-3 text-[13px] font-normal text-text-primary 
        outline-none transition placeholder:text-text-placeholder 
        focus:border-primary focus:ring-2 focus:ring-primary/15" />
    </label>
</template>
<style scoped></style>