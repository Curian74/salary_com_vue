<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface MsMenuOption {
    value: string | number | null
    label?: string
    name?: string
    disabled?: boolean
}

interface MsMenuProps {
    options?: MsMenuOption[]
    modelValue: string | number | null
    disabled?: boolean
    emptyText?: string
}

const props = withDefaults(defineProps<MsMenuProps>(), {
    options: () => [],
    disabled: false,
    emptyText: 'Không có dữ liệu',
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    select: [option: MsMenuOption]
}>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function closeMenu() {
    isOpen.value = false
}

function openMenu() {
    if (props.disabled) {
        return
    }

    isOpen.value = true
}

function toggleMenu() {
    if (isOpen.value) {
        closeMenu()
        return
    }

    openMenu()
}

function handleDocumentPointerDown(event: PointerEvent) {
    if (!isOpen.value) {
        return
    }

    const target = event.target as Node | null

    if (target && menuRef.value?.contains(target)) {
        return
    }

    closeMenu()
}

function handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeMenu()
    }
}

function isSelected(option: MsMenuOption) {
    return option.value === props.modelValue
}

function getOptionLabel(option: MsMenuOption) {
    return option.label ?? option.name ?? String(option.value ?? '')
}

function selectOption(option: MsMenuOption) {
    if (option.disabled) {
        return
    }

    emit('update:modelValue', option.value)
    emit('select', option)
    closeMenu()
}

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) {
            closeMenu()
        }
    },
)

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown)
    document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown)
    document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
    <div ref="menuRef" class="relative inline-block">
        <slot name="trigger" :open="toggleMenu" :show="openMenu" :close="closeMenu" :is-open="isOpen" />

        <div v-if="isOpen" class="absolute left-0 top-full z-10000 mt-1 overflow-hidden w-43 rounded-lg
             border border-border bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)]" role="menu">
            <div v-if="options.length === 0" class="px-3 py-2 text-[14px] leading-5 text-text-placeholder">
                {{ emptyText }}
            </div>

            <button v-for="option in options" :key="String(option.value)" type="button" class="flex min-h-9 w-full
                 items-center justify-between gap-6 px-3 text-left 
                 text-[13px] leading-5 transition" :class="[
                    isSelected(option) ? 'bg-focus text-primary' : 'text-text-primary hover:bg-background',
                    option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ]" :disabled="option.disabled" role="menuitemradio" :aria-checked="isSelected(option)"
                @click="selectOption(option)">
                <span class="truncate">{{ getOptionLabel(option) }}</span>

                <svg v-if="isSelected(option)" class="size-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <path d="m20 6-11 11-5-5" />
                </svg>
            </button>
        </div>
    </div>
</template>
