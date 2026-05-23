<script setup lang="ts">
import AppIcon from '@/components/icons/AppIcon.vue'
import HeaderIconButton from './header/HeaderIconButton.vue'
import HeaderSearch from './header/HeaderSearch.vue'

const headerActions = [
  { icon: 'settings', label: 'Thiết lập' },
  { icon: 'assistant', label: 'Trợ lý' },
  { icon: 'megaphone', label: 'Thông báo sản phẩm' },
  { icon: 'message', label: 'Tin nhắn' },
  { icon: 'bell', label: 'Thông báo' },
  { icon: 'help', label: 'Trợ giúp' },
  { icon: 'more', label: 'Thêm' },
  { icon: 'guide', label: 'Hướng dẫn', tone: 'warning' },
]
</script>

<template>
  <header class="flex items-center justify-between bg-primary px-1 py-1 text-on-primary shadow-header-divider">
    <div class="flex min-w-0 items-center gap-2">
      <button
        class="flex size-10 shrink-0 items-center justify-center rounded-lg transition hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring"
        type="button" aria-label="Mở danh sách ứng dụng">
        <AppIcon name="app-launcher" />
      </button>

      <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-on-primary-surface">
        <AppIcon name="payroll-logo" class="size-8" />
      </div>

      <h1 class="truncate text-[18px] font-bold leading-8 tracking-normal">Tiền lương</h1>
    </div>

    <div class="mr-2 flex shrink-0 items-center gap-3">
      <div class="hidden w-90 justify-center xl:w-107.5 2xl:w-75 lg:flex">
        <HeaderSearch />
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <HeaderIconButton v-for="action in headerActions" :key="action.label" :icon="action.icon" :label="action.label"
          :tone="action.tone" />
      </div>

      <button
        class="relative flex size-10 items-center justify-center rounded-full transition hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring"
        type="button" aria-label="Tài khoản">
        <AppIcon name="profile-p1" class="size-10 rounded-full w-8 h-8" />
        <span
          class="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-notification text-[11px] font-bold leading-none">
          2
        </span>
      </button>
    </div>
  </header>
</template>
