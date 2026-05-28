<script setup lang="ts">
import { computed } from 'vue'

export type MsStatusVariant = 'success' | 'neutral' | 'warning' | 'danger'

interface MsStatusProps {
    text: string
    variant?: MsStatusVariant
}

const props = withDefaults(defineProps<MsStatusProps>(), {
    variant: 'neutral',
})

const baseClasses = [
    'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-[8px] border px-2.5',
    'text-[14px] font-medium leading-none',
]

const variantClasses: Record<MsStatusVariant, string> = {
    success: 'border-primary/30 bg-focus text-primary',
    neutral: 'border-border bg-grid-header text-text-secondary',
    warning: 'border-warning bg-warning/10 text-pending',
    danger: 'border-error/30 bg-error/10 text-error',
}

const dotClasses: Record<MsStatusVariant, string> = {
    success: 'bg-primary',
    neutral: 'bg-text-secondary',
    warning: 'bg-pending',
    danger: 'bg-error',
}

const statusClasses = computed(() => [
    ...baseClasses,
    variantClasses[props.variant],
])
</script>

<template>
    <span :class="statusClasses">
        <span class="size-1.5 shrink-0 rounded-full" :class="dotClasses[variant]" aria-hidden="true"></span>
        <span>{{ text }}</span>
    </span>
</template>
