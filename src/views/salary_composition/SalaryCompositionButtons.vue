<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue'
import MsIcon from '@/components/base/MsIcon.vue';
import MsMenu, { type MsMenuOption } from '@/components/base/MsMenu.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const addMenuOptions: MsMenuOption[] = [
  {
    value: 'system-category',
    label: 'Chọn từ danh mục của hệ thống',
  },
];

const handleAddClick = () => {
  router.push({ name: 'SalaryCompositionAdd' });
};
</script>

<template>
  <div class="flex flex-wrap items-center justify-end gap-2">
    <MsButton variant="secondary">
      <template #prepend>
        <MsIcon name="salary-system-category" />
      </template>
      Danh mục của hệ thống
    </MsButton>

    <MsMenu :options="addMenuOptions" :width="280" align="right">
      <template #trigger="{ open, isOpen }">
        <div class="inline-flex h-9 rounded-lg bg-primary text-white shadow-sm">
          <MsButton variant="primary" class="rounded-r-none! shadow-none!" @click="handleAddClick">
            <template #prepend>
              <MsIcon name="salary-add" />
            </template>
            Thêm
          </MsButton>

          <MsButton @click="open" variant="primary"
            class="h-9 w-9 rounded-l-none! border-l border-white/20 p-0 shadow-none! focus:ring-white/40">
            <svg class="size-4 transition-transform" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </MsButton>
        </div>
      </template>
    </MsMenu>
  </div>
</template>
