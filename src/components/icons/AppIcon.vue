<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  name: string
}>()

const iconClasses: Record<string, string> = {
  settings: 'icon-sprite icon-sprite-white settings-icon',
  assistant: 'icon-image assistant-icon',
  megaphone: 'icon-sprite icon-sprite-white megaphone-icon',
  message: 'icon-sprite message-icon',
  bell: 'icon-sprite icon-sprite-white bell-icon',
  help: 'icon-sprite icon-sprite-white help-icon',
  more: 'icon-sprite icon-sprite-white more-icon',
  guide: 'icon-image guide-icon',
  search: 'icon-image search-icon',
}
</script>

<template>
  <span class="icon" :class="iconClasses[props.name]" v-bind="$attrs" aria-hidden="true"></span>
</template>
