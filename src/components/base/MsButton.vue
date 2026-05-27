<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import MsLoading from './MsLoading.vue'

defineOptions({
    inheritAttrs: false,
})

export type MsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'
export type MsButtonSize = 'sm' | 'md'
export type MsButtonType = 'button' | 'submit' | 'reset'

interface MsButtonProps {
    variant?: MsButtonVariant
    size?: MsButtonSize
    type?: MsButtonType
    disabled?: boolean
    loading?: boolean
}

// Định nghĩa giá trị props default
const props = withDefaults(defineProps<MsButtonProps>(), {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
})

const emit = defineEmits(['click']);

const isDisabled = computed(() => props.disabled || props.loading)

const baseClasses = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition',
    'focus:outline-none focus:ring-2 cursor-pointer',
    'disabled:cursor-not-allowed disabled:opacity-60',
]

const sizeClasses: Record<MsButtonSize, string> = {
    sm: 'h-8 px-2.5 text-[13px]',
    md: 'h-9 px-3 text-[14px]',
}

const variantClasses: Record<MsButtonVariant, string> = {
    primary: 'bg-primary text-white shadow-sm hover:bg-primary-hover active:bg-primary-pressed focus:ring-primary/25',
    secondary: 'border border-border bg-white text-[#001b44] shadow-sm hover:bg-[#f8f9fb] focus:ring-primary/20',
    ghost: 'bg-transparent text-text-secondary hover:bg-background focus:ring-primary/15',
    icon: 'border border-[#d7dce1] bg-white text-[#6b7280] hover:bg-[#f8f9fb] focus:ring-primary/15',
}

// Thuộc tính để bind vào template (array)
const buttonClasses = computed(() => [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
])

function handleClick(event: MouseEvent) {
    if (isDisabled.value) {
        // Prevent sự kiện mặc định khi click
        event.preventDefault()
        event.stopImmediatePropagation()
        return;
    }

    emit('click', event);
}

</script>

<template>
    <button v-bind="$attrs" :type="type" :disabled="isDisabled" :aria-busy="loading" :class="buttonClasses"
        @click="handleClick">
        <ms-loading v-if="loading" size="sm" class="shrink-0" />
        <slot v-else name="prepend"></slot>
        <slot></slot>
        <slot name="append"></slot>
    </button>
</template>
