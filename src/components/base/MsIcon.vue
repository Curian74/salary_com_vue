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
  'sidebar-home': 'icon-sprite sidebar-home-icon',
  'sidebar-database': 'icon-sprite sidebar-database-icon',
  'sidebar-math': 'icon-sprite sidebar-math-icon',
  'sidebar-moneybag': 'icon-sprite sidebar-moneybag-icon',
  'sidebar-chart': 'icon-sprite sidebar-chart-icon',
  'sidebar-template': 'icon-sprite sidebar-template-icon',
  'sidebar-comp': 'icon-sprite sidebar-comp-icon',
  'sidebar-collapse': 'icon-sprite sidebar-collapse-icon',
  'sidebar-chevron-right': 'icon-sprite sidebar-chevron-right',
  'salary-filter': 'icon-sprite salary-composition-filter-icon',
  'salary-system-category': 'icon-sprite salary-system-category-icon',
  'salary-add': 'icon-sprite icon-sprite-white salary-add-icon',
  'table-settings': 'icon-sprite table-col-settings-icon',
  'table-filter': 'icon-sprite table-col-filter-icon',
  'table-not-found': 'icon-sprite table-not-found-icon',
  'info-icon': 'icon-sprite info-icon',
  'eye': 'icon-mask row-action-eye-icon',
  'copy': 'icon-mask row-action-copy-icon',
  'pencil': 'icon-sprite_sec pencil-icon',
  'trash': 'icon-sprite_sec trash-icon',
  'circle-minus': 'icon-sprite_sec row-action-circle-minus-icon',
  'circle-check': 'icon-mask row-action-circle-check-icon',
  'threedot': 'icon-sprite threedot-icon',
  'arrow-left': 'icon-sprite_sec arrow-left-icon',
  'duplicate': 'icon-sprite_sec duplicate-icon',
}
</script>

<template>
  <span class="icon cursor-pointer" :class="iconClasses[props.name]" v-bind="$attrs" aria-hidden="true"></span>
</template>
