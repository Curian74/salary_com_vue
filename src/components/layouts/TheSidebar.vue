<script setup lang="ts">
import MsIcon from '@/components/base/MsIcon.vue'
import MsTooltip from '@/components/base/MsTooltip.vue'

const sidebarItems = [
  { icon: 'sidebar-home', label: 'Tổng quan' },
  { icon: 'sidebar-comp', label: 'Thành phần lương', active: true },
  { icon: 'sidebar-template', label: 'Mẫu bảng lương' },
  { icon: 'sidebar-database', label: 'Dữ liệu tính lương', expandable: true },
  { icon: 'sidebar-math', label: 'Tính lương', expandable: true },
  { icon: 'sidebar-moneybag', label: 'Chi trả', expandable: true },
  { icon: 'sidebar-chart', label: 'Báo cáo' },
]

</script>

<template>
  <aside class="relative flex w-60 pr-3.25 shrink-0 flex-col border-r border-border bg-on-primary pb-16 pt-3">
    <nav class="flex flex-col gap-1 px-4">
      <MsTooltip v-for="item in sidebarItems" :key="item.label" :content="item.label" :show-arrow="true"
        placement="right">
        <div class="flex cursor-pointer h-8 items-center gap-2 rounded-lg px-3.75 text-[16px] font-semibold transition"
          :class="item.active ? 'bg-focus text-primary' : 'text-text-primary hover:bg-background'">
          <MsIcon :name="item.icon" class="sidebar-menu-icon"
            :class="item.active ? 'sidebar-menu-icon-active' : 'sidebar-menu-icon-default'" />
          <span class="min-w-0 flex-1 truncate text-[13px]">{{ item.label }}</span>
          <MsIcon v-if="item.expandable" name="sidebar-chevron-right"
            class="sidebar-menu-icon sidebar-menu-icon-default" />
        </div>
      </MsTooltip>
    </nav>

    <MsTooltip content="Thu gọn menu" placement="right">
      <button class="absolute bg-[#fafafa] bottom-0 right-0 flex w-10 h-10 items-center justify-center rounded-tl-lg
         border border-border text-text-secondary transition hover:bg-background" type="button"
        aria-label="Thu gọn menu">
        <MsIcon name="sidebar-collapse" class="sidebar-menu-icon sidebar-menu-icon-default" />
      </button>
    </MsTooltip>
  </aside>
</template>
