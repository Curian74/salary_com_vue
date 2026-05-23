<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    label: string
    tone?: string
  }>(),
  {
    tone: 'white',
  },
)
</script>

<template>
  <button
    class="group flex size-8 items-center justify-center rounded-lg transition hover:bg-on-primary-hover-bg focus:outline-none focus:ring-2 focus:ring-on-primary-ring"
    :class="tone === 'warning' ? 'hover:bg-warning/15' : ''"
    type="button"
    :aria-label="label"
    :title="label"
  >
    <img class="size-6 transition group-hover:scale-105" :src="src" alt="" aria-hidden="true" />
  </button>
</template>
