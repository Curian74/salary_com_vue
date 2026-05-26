<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-end gap-2">
    <MsButton variant="secondary">
      <template #prepend>
        <svg class="size-4 text-[#6b7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </template>
      Danh mục của hệ thống
    </MsButton>

    <div class="inline-flex h-9 overflow-hidden rounded-lg bg-primary text-white shadow-sm">
      <MsButton :loading="true" variant="primary" class="rounded-none! shadow-none!">
        <template #prepend>
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </template>
        Thêm
      </MsButton>
      <MsButton variant="primary"
        class="h-9 w-9 rounded-none border-l border-white/20 p-0 shadow-none! focus:ring-white/40">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </MsButton>
    </div>
  </div>
</template>
