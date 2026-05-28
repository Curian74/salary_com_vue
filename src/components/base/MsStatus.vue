<script setup lang="ts">
import { computed } from 'vue'

export type MsStatusVariant = 'success' | 'warning'

interface MsStatusProps {
    text: string
    variant?: MsStatusVariant
}

const props = withDefaults(defineProps<MsStatusProps>(), {
    variant: 'warning',
})

const baseClasses = [
    'inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[8px] border px-2.5',
    'text-[13px] leading-none',
]

const variantClasses: Record<MsStatusVariant, string> = {
    success: 'border-[#75e0ac] bg-[#edfcf4] text-primary',
    warning: 'border-[#fedf89] bg-[#fffaeb] text-[#dc6803]',
}

const dotClasses: Record<MsStatusVariant, string> = {
    success: 'bg-primary',
    warning: 'bg-[#f79009]',
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
