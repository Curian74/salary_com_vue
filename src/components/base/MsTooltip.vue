<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tooltip } from 'floating-vue'
import type { TriggerEvent } from 'floating-vue'

type MsTooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

type MsTooltipDelay = number | {
  show: number
  hide: number
}

type MsTooltipStrategy = 'absolute' | 'fixed'

interface MsTooltipProps {
  content: string | number
  placement?: MsTooltipPlacement
  disabled?: boolean
  delay?: MsTooltipDelay
  distance?: number
  triggers?: TriggerEvent[]
  showArrow?: boolean
  strategy?: MsTooltipStrategy
  container?: string | Element | false
}

const props = withDefaults(defineProps<MsTooltipProps>(), {
  placement: 'bottom',
  disabled: false,
  delay: () => ({ show: 200, hide: 0 }),
  distance: 8,
  triggers: () => ['hover', 'focus'],
  showArrow: false,
  // Fixed giúp tooltip không làm tăng vùng scroll của trang.
  strategy: 'fixed',
  container: 'body',
})

const isDisabled = computed(() => {
  return props.disabled || String(props.content).trim().length === 0
})

const tooltipRef = ref<InstanceType<typeof Tooltip> | null>(null)

function getReferenceNode(): Element {
  const rootElement = tooltipRef.value?.$el as Element | undefined
  const targetElement = rootElement?.firstElementChild

  if (targetElement) {
    return targetElement
  }

  if (rootElement) {
    return rootElement
  }

  return document.body
}

const popperClass = computed(() => {
  return props.showArrow ? 'ms-tooltip--with-arrow' : 'ms-tooltip--without-arrow'
})
</script>

<template>
  <Tooltip ref="tooltipRef" class="contents" theme="ms-tooltip" :popper-class="popperClass"
    :reference-node="getReferenceNode" :placement="placement" :disabled="isDisabled" :delay="delay" :distance="distance"
    :triggers="triggers" :strategy="strategy" :container="container">
    <slot />

    <template #popper>
      {{ content }}
    </template>
  </Tooltip>
</template>
