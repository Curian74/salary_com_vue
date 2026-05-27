<script setup lang='ts'>
import { computed } from 'vue'

defineOptions({
    name: "MsLoading"
})

export type MsLoadingSize = 'sm' | 'md' | 'lg'

interface MsLoadingProps {
    size?: MsLoadingSize
    label?: string
}

const props = withDefaults(defineProps<MsLoadingProps>(), {
    size: 'md',
    label: 'Đang tải',
})

const sizeClasses: Record<MsLoadingSize, string> = {
    sm: 'size-4 border-2',
    md: 'size-6 border-2',
    lg: 'size-8 border-[3px]',
}

const spinnerClasses = computed(() => [
    'inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent',
    sizeClasses[props.size],
])

</script>
<template>
    <span class="inline-flex items-center justify-center text-current" role="status" :aria-label="label">
        <span :class="spinnerClasses" aria-hidden="true"></span>
        <span class="sr-only">{{ label }}</span>
    </span>
</template>
<style scoped></style>
