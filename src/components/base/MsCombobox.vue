<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import configKeys from '@/constants/configs/configKeys';
import MsLoading from './MsLoading.vue';

defineOptions({
    inheritAttrs: false,
});

export interface MsComboboxOption {
    value: string | number | null
    label?: string
    name?: string
    disabled?: boolean
    readonly?: boolean
}

interface MsComboboxProps {
    id?: string
    modelValue?: string | number | null
    options?: MsComboboxOption[]
    disabled?: boolean
    invalid?: boolean
    placeholder?: string
    emptyText?: string
    noResultsText?: string
    align?: 'left' | 'right'
    isLoading?: boolean
    hasMore?: boolean
    allowLazyLoad?: boolean
    searchable?: boolean
    debounceMs?: number
}

const props = withDefaults(defineProps<MsComboboxProps>(), {
    options: () => [],
    disabled: false,
    invalid: false,
    placeholder: '',
    emptyText: 'Không có dữ liệu',
    noResultsText: 'Không tìm thấy kết quả',
    align: 'left',
    isLoading: false,
    hasMore: false,
    allowLazyLoad: false,
    searchable: false,
    debounceMs: configKeys.DEBOUCE_TIMER,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    change: [value: string | number | null]
    scrollEnd: []
    search: [query: string]
}>();

const attrs = useAttrs();
const isOpen = ref(false);
const triggerRef = ref<HTMLButtonElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const query = ref('');
const isSearching = ref(false);

let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;

const selectedOption = computed(() =>
    props.options.find((option) => option.value === props.modelValue),
);

const selectedLabel = computed(() => {
    const option = selectedOption.value;

    if (!option) {
        return '';
    }

    return option.label ?? option.name ?? String(option.value ?? '');
});

const inputDisplayValue = computed(() => {
    if (isSearching.value) {
        return query.value;
    }

    return selectedLabel.value;
});

const showPlaceholder = computed(() =>
    !isSearching.value && !selectedOption.value,
);

const isEmpty = computed(() => props.options.length === 0);

const isNoResults = computed(() =>
    props.searchable
    && query.value.trim().length > 0
    && isEmpty.value
    && !props.isLoading,
);

const showEmptyText = computed(() =>
    isEmpty.value
    && !props.isLoading
    && !isNoResults.value,
);

const closeMenu = () => {
    isOpen.value = false;

    if (props.searchable) {
        query.value = '';
        isSearching.value = false;
    }
};

const openMenu = (resetQuery = true) => {
    if (props.disabled) {
        return;
    }

    const wasClosed = !isOpen.value;

    isOpen.value = true;

    if (props.searchable && wasClosed && resetQuery) {
        query.value = '';
        isSearching.value = false;
    }
};

const toggleMenu = () => {
    if (isOpen.value) {
        closeMenu();
        return;
    }

    openMenu();
};

const focusTrigger = () => {
    if (props.searchable) {
        inputRef.value?.focus();
        return;
    }

    triggerRef.value?.focus();
};

const isSelected = (option: MsComboboxOption) => option.value === props.modelValue;

const getOptionLabel = (option: MsComboboxOption) => {
    return option.label;
}

const selectOption = (option: MsComboboxOption) => {
    if (option.disabled) {
        return;
    }

    emit('update:modelValue', option.value);
    emit('change', option.value);
    closeMenu();
    focusTrigger();
};

const scheduleSearch = (value: string) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        emit('search', value.trim());
    }, props.debounceMs);
};

const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    query.value = target.value;
    isSearching.value = true;
    openMenu(false);
    scheduleSearch(target.value);
};

const handleInputFocus = () => {
    if (props.disabled) {
        return;
    }

    openMenu();
};

const handleInputClick = () => {
    if (props.disabled) {
        return;
    }

    openMenu();
};

const handleMenuScroll = (event: Event) => {
    if (!props.allowLazyLoad || props.isLoading || !props.hasMore) {
        return;
    }

    const element = event.target as HTMLElement;

    const isReachEnd = element.scrollTop + element.clientHeight
        >= element.scrollHeight - 4;

    if (isReachEnd) {
        emit('scrollEnd');
    }
};

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) {
            closeMenu();
        }
    },
);

</script>

<template>
    <div ref="selectRef" class="relative inline-block" :class="attrs.class" :style="attrs.style">
        <button v-if="!searchable" ref="triggerRef" :id="id" type="button" class="ms-combobox__trigger cursor-pointer"
            :class="{
                'ms-combobox__trigger--invalid': invalid,
                'ms-combobox__trigger--placeholder': !selectedOption,
            }" :disabled="disabled" aria-haspopup="listbox" :aria-expanded="isOpen" @click="toggleMenu">
            <span class="truncate">{{ selectedLabel || placeholder }}</span>

            <svg class="size-4 shrink-0 text-text-secondary transition" :class="{ 'rotate-180': isOpen }"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>

        <div v-else class="ms-combobox__trigger ms-combobox__trigger--input" :class="{
            'ms-combobox__trigger--invalid': invalid,
            'ms-combobox__trigger--placeholder': showPlaceholder,
        }">
            <input ref="inputRef" :id="id" type="text" class="ms-combobox__input" role="combobox"
                :value="inputDisplayValue" :placeholder="placeholder" :disabled="disabled" :aria-expanded="isOpen"
                autocomplete="off" @input="handleInputChange" @focus="handleInputFocus" @click="handleInputClick">

            <button type="button" class="ms-combobox__chevron" :disabled="disabled" tabindex="-1" aria-hidden="true"
                @click="toggleMenu">
                <svg class="size-4 shrink-0 text-text-secondary transition" :class="{ 'rotate-180': isOpen }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
        </div>

        <div v-if="isOpen" class="ms-combobox__menu" :class="align === 'right' ? 'right-0' : 'left-0'" role="listbox"
            @scroll="handleMenuScroll">
            <div v-if="showEmptyText" class="px-3 py-2 text-[14px] leading-5 text-text-placeholder">
                {{ emptyText }}
            </div>

            <div v-if="isNoResults" class="px-3 py-2 text-[14px] leading-5 text-text-placeholder">
                {{ noResultsText }}
            </div>

            <button v-for="(option, index) in options" :key="String(option.value)" type="button"
                class="ms-combobox__option" :class="[
                    isSelected(option)
                        ? 'bg-[#eafbf2] text-primary'
                        : 'text-text-primary hover:bg-background',
                    option.disabled ? 'cursor-not-allowed opacity-50 bg-[#f5f5f5]' : 'cursor-pointer',
                ]" :disabled="option.disabled" role="option" :aria-selected="isSelected(option)"
                @click="selectOption(option)">
                <slot :option="option" name="option">
                    <span class="truncate">{{ getOptionLabel(option) }}</span>
                </slot>
                <div class="ml-auto">
                    <slot :option="option" name="right" />
                </div>
            </button>

            <div v-if="isLoading" class="ms-combobox__loading">
                <MsLoading size="sm" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.ms-combobox__trigger {
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

.ms-combobox__trigger:hover {
    border-color: var(--app-color-primary);
}

.ms-combobox__trigger:focus-within,
.ms-combobox__trigger:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

.ms-combobox__trigger:disabled,
.ms-combobox__trigger--input:has(.ms-combobox__input:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
}

.ms-combobox__trigger--invalid,
.ms-combobox__trigger--invalid:hover,
.ms-combobox__trigger--invalid:focus,
.ms-combobox__trigger--invalid:focus-within {
    border-color: var(--app-color-error);
}

.ms-combobox__trigger--invalid:focus,
.ms-combobox__trigger--invalid:focus-within {
    box-shadow: 0 0 0 2px rgba(229, 72, 72, 0.12);
}

.ms-combobox__trigger--placeholder .ms-combobox__input::placeholder {
    color: #c5cad1;
}

.ms-combobox__trigger--input {
    padding: 0 9px 0 0;
}

.ms-combobox__input {
    min-width: 0;
    flex: 1;
    border: 0;
    background: transparent;
    padding: 0 0 0 9px;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    outline: none;
}

.ms-combobox__input:disabled {
    cursor: not-allowed;
}

.ms-combobox__chevron {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    padding: 0 9px 0 0;
    cursor: pointer;
}

.ms-combobox__chevron:disabled {
    cursor: not-allowed;
}

.ms-combobox__menu {
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

.ms-combobox__option {
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

.ms-combobox__loading {
    display: flex;
    min-height: 36px;
    align-items: center;
    justify-content: center;
    color: var(--app-color-primary);
}
</style>
