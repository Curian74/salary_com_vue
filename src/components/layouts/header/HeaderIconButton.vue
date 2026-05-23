<script setup lang="ts">
import MsIcon from '@/components/base/MsIcon.vue';

export interface HeaderIconButtonProps {
  icon: string
  label: string
}

const props = defineProps<HeaderIconButtonProps>();

</script>

<template>
  <button class="group flex size-8 items-center justify-center rounded-lg transition
     hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring" type="button"
    :aria-label="label" :title="label">
    <MsIcon :name="icon" class="size-6 transition group-hover:scale-105" />
  </button>
</template>
