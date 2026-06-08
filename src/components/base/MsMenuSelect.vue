<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';

defineOptions({
    inheritAttrs: false,
});

export interface MsMenuSelectOption {
    value: string | number | null
    label?: string
    name?: string
    disabled?: boolean
}

interface MsMenuSelectProps {
    id?: string
    modelValue?: string | number | null
    options?: MsMenuSelectOption[]
    disabled?: boolean
    invalid?: boolean
    placeholder?: string
    emptyText?: string
    align?: 'left' | 'right'
}

const props = withDefaults(defineProps<MsMenuSelectProps>(), {
    options: () => [],
    disabled: false,
    invalid: false,
    placeholder: '',
    emptyText: 'Không có dữ liệu',
    align: 'left',
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    change: [value: string | number | null]
}>();

const attrs = useAttrs();
const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);

const selectedOption = computed(() =>
    props.options.find((option) => option.value === props.modelValue),
);

const selectedLabel = computed(() => {
    const option = selectedOption.value;

    if (!option) {
        return props.placeholder;
    }

    return option.label ?? option.name ?? String(option.value ?? '');
});

const isEmpty = computed(() => props.options.length === 0);

function closeMenu() {
    isOpen.value = false;
}

function openMenu() {
    if (props.disabled) {
        return;
    }

    isOpen.value = true;
}

function toggleMenu() {
    if (isOpen.value) {
        closeMenu();
        return;
    }

    openMenu();
}

function handleDocumentPointerDown(event: PointerEvent) {
    if (!isOpen.value) {
        return;
    }

    const target = event.target as Node | null;

    if (target && selectRef.value?.contains(target)) {
        return;
    }

    closeMenu();
}

function handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeMenu();
    }
}

function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenu();
    }
}

function isSelected(option: MsMenuSelectOption) {
    return option.value === props.modelValue;
}

function getOptionLabel(option: MsMenuSelectOption) {
    return option.label ?? option.name ?? String(option.value ?? '');
}

function selectOption(option: MsMenuSelectOption) {
    if (option.disabled) {
        return;
    }

    emit('update:modelValue', option.value);
    emit('change', option.value);
    closeMenu();
    triggerRef.value?.focus();
}

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) {
            closeMenu();
        }
    },
);

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>

<template>
    <div ref="selectRef" class="relative inline-block" :class="attrs.class" :style="attrs.style">
        <button ref="triggerRef" :id="id" type="button" class="ms-menu-select__trigger" :class="{
            'ms-menu-select__trigger--invalid': invalid,
            'ms-menu-select__trigger--placeholder': !selectedOption,
        }" :disabled="disabled" aria-haspopup="listbox" :aria-expanded="isOpen" @click="toggleMenu"
            @keydown="handleTriggerKeydown">
            <span class="truncate">{{ selectedLabel }}</span>

            <svg class="size-4 shrink-0 text-text-secondary transition" :class="{ 'rotate-180': isOpen }"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>

        <div v-if="isOpen" class="ms-menu-select__menu" :class="align === 'right' ? 'right-0' : 'left-0'"
            role="listbox">
            <div v-if="isEmpty" class="px-3 py-2 text-[14px] leading-5 text-text-placeholder">
                {{ emptyText }}
            </div>

            <button v-for="option in options" :key="String(option.value)" type="button" class="ms-menu-select__option"
                :class="[
                    isSelected(option) ? 'bg-[#eafbf2] text-primary' : 'text-text-primary hover:bg-background',
                    option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ]" :disabled="option.disabled" role="option" :aria-selected="isSelected(option)"
                @click="selectOption(option)">
                <span class="truncate">{{ getOptionLabel(option) }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.ms-menu-select__trigger {
    display: flex;
    min-height: 34px;
    width: 100%;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid #cfd4da;
    border-radius: 8px;
    background: #ffffff;
    padding: 0 9px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
    outline: none;
    text-align: left;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.ms-menu-select__trigger:hover {
    border-color: #aab2bd;
    background: #f8f9fb;
}

.ms-menu-select__trigger:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

.ms-menu-select__trigger:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.ms-menu-select__trigger--invalid,
.ms-menu-select__trigger--invalid:hover,
.ms-menu-select__trigger--invalid:focus {
    border-color: var(--app-color-error);
}

.ms-menu-select__trigger--invalid:focus {
    box-shadow: 0 0 0 2px rgba(229, 72, 72, 0.12);
}

.ms-menu-select__trigger--placeholder {
    color: #c5cad1;
}

.ms-menu-select__menu {
    position: absolute;
    top: 100%;
    z-index: 10000;
    margin-top: 4px;
    width: 100%;
    min-width: max-content;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid var(--app-color-border);
    border-radius: 8px;
    background: #ffffff;
    padding: 4px 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
}

.ms-menu-select__option {
    display: flex;
    min-height: 32px;
    width: 100%;
    min-width: 0;
    align-items: center;
    padding: 0 12px;
    border: 0;
    font-size: 13px;
    line-height: 20px;
    text-align: left;
    transition: background-color 0.15s ease, color 0.15s ease;
}
</style>
