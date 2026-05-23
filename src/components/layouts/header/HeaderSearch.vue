<script setup lang="ts">
import searchIcon from '@/assets/icons/header/search.svg'
</script>

<template>
  <label class="relative block w-full">
    <span class="sr-only">Tìm kiếm</span>
    <img class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 opacity-80" :src="searchIcon" alt=""
      aria-hidden="true" />
    <input class="h-8 w-full px-10 rounded-lg border border-transparent
       bg-on-primary-field pl-11 pr-4 text-[13px] font-semibold
        text-on-primary outline-none transition placeholder:text-on-primary-muted
         focus:border-on-primary-border-focus focus:bg-on-primary-field-focus
          focus:ring-2 focus:ring-on-primary-ring-muted" type="search" placeholder="Tìm kiếm" />
  </label>
</template>
