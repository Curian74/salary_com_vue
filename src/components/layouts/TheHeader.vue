<script setup lang="ts">
import HeaderIconButton from './header/HeaderIconButton.vue'
import HeaderSearch from './header/HeaderSearch.vue'

import appLauncherIcon from '@/assets/icons/header/app-launcher.svg'
import assistantIcon from '@/assets/icons/header/assistant.svg'
import bellIcon from '@/assets/icons/header/bell.svg'
import guideIcon from '@/assets/icons/header/guide.svg'
import helpIcon from '@/assets/icons/header/help.svg'
import megaphoneIcon from '@/assets/icons/header/megaphone.svg'
import messageIcon from '@/assets/icons/header/message.svg'
import moreIcon from '@/assets/icons/header/more.svg'
import payrollLogo from '@/assets/icons/header/icon-payroll-logo.svg'
import profileIcon from '@/assets/icons/header/profile-p1.svg'
import settingsIcon from '@/assets/icons/header/settings.svg'

const headerActions = [
  { icon: settingsIcon, label: 'Thiết lập' },
  { icon: assistantIcon, label: 'Trợ lý' },
  { icon: megaphoneIcon, label: 'Thông báo sản phẩm' },
  { icon: messageIcon, label: 'Tin nhắn' },
  { icon: bellIcon, label: 'Thông báo' },
  { icon: helpIcon, label: 'Trợ giúp' },
  { icon: moreIcon, label: 'Thêm' },
  { icon: guideIcon, label: 'Hướng dẫn', tone: 'warning' },
]
</script>

<template>
  <header class="flex items-center justify-between bg-primary py-1 px-2 text-on-primary shadow-header-divider">
    <div class="flex min-w-0 items-center gap-3">
      <button
        class="flex size-10 shrink-0 items-center justify-center rounded-lg transition hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring"
        type="button" aria-label="Mở danh sách ứng dụng">
        <img class="size-6" :src="appLauncherIcon" alt="" aria-hidden="true" />
      </button>

      <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-on-primary-surface">
        <img class="size-8" :src="payrollLogo" alt="" aria-hidden="true" />
      </div>

      <h1 class="truncate text-[18px] font-bold leading-8 tracking-normal">Tiền lương</h1>
    </div>

    <div class="flex shrink-0 items-center gap-3">
      <div class="hidden flex-1 justify-center lg:flex">
        <HeaderSearch />
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <HeaderIconButton v-for="action in headerActions" :key="action.label" :src="action.icon" :label="action.label"
          :tone="action.tone" />
      </div>

      <button class="relative flex size-10 items-center justify-center rounded-full
         transition hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring"
        type="button" aria-label="Tài khoản">
        <img class="size-10" :src="profileIcon" alt="" aria-hidden="true" />
        <span class="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center
           rounded-full border-2 border-primary bg-notification text-[11px] font-bold leading-none">
          2
        </span>
      </button>
    </div>
  </header>
</template>
