<script setup lang="ts">
import AppIcon from '@/components/icons/AppIcon.vue'
</script>

<template>
  <label class="relative block w-full">
    <span class="sr-only">Tìm kiếm</span>
    <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 opacity-80" />
    <input
      class="h-8 w-full rounded-lg border border-transparent bg-on-primary-field px-10 pl-11 pr-4 text-[13px] font-semibold text-on-primary outline-none transition placeholder:text-on-primary-muted focus:border-on-primary-border-focus focus:bg-on-primary-field-focus focus:ring-2 focus:ring-on-primary-ring-muted"
      type="search"
      placeholder="Tìm kiếm"
    />
  </label>
</template>
