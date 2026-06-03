<script setup lang="ts">
import { ref, watchEffect } from 'vue';

interface Props {
    checked?: boolean;
    indeterminate?: boolean; // Chọn một vài
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    checked: false,
    indeterminate: false,
    disabled: false,
});

const emit = defineEmits<{
    change: [checked: boolean]
}>();

const checkboxRef = ref<HTMLInputElement | null>(null);

// useEffect
// Theo dõi checkboxRef và props.indeterminate
watchEffect(() => {
    if (checkboxRef.value) {
        checkboxRef.value.indeterminate = props.indeterminate;
    }
});

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('change', target.checked);
}
</script>

<template>
    <label class="ms-checkbox" :class="{ 'ms-checkbox--disabled': disabled }">
        <input ref="checkboxRef" @change="handleChange" :checked="checked" :disabled="disabled"
            class="ms-checkbox__input" type="checkbox" />

        <span class="ms-checkbox__box" :class="{
            'ms-checkbox__box--checked': checked && !indeterminate,
            'ms-checkbox__box--indeterminate': indeterminate,
        }" aria-hidden="true">
            <svg v-if="checked && !indeterminate" class="ms-checkbox__icon" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.2L6.5 11L12.5 5" />
            </svg>

            <span v-if="indeterminate" class="ms-checkbox__dash"></span>
        </span>
    </label>
</template>

<style scoped>
.ms-checkbox {
    --ms-checkbox-size: 16px;
    --ms-checkbox-icon-size: 12px;

    position: relative;
    display: inline-flex;
    width: var(--ms-checkbox-size);
    height: var(--ms-checkbox-size);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    vertical-align: middle;
}

.ms-checkbox__input {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: inherit;
    opacity: 0;
}

.ms-checkbox__box {
    display: inline-flex;
    width: var(--ms-checkbox-size);
    height: var(--ms-checkbox-size);
    align-items: center;
    justify-content: center;
    border: 1px solid #cfd4da;
    border-radius: 4px;
    background: #ffffff;
    color: #ffffff;
    box-sizing: border-box;
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.ms-checkbox:hover .ms-checkbox__input:not(:disabled)+.ms-checkbox__box {
    border-color: var(--app-color-primary);
}

.ms-checkbox__box--checked,
.ms-checkbox__box--indeterminate {
    border-color: var(--app-color-primary);
    background: var(--app-color-primary);
}

.ms-checkbox__input:focus-visible+.ms-checkbox__box {
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.2);
}

.ms-checkbox__icon {
    width: var(--ms-checkbox-icon-size);
    height: var(--ms-checkbox-icon-size);
}

.ms-checkbox__icon path {
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.ms-checkbox__dash {
    width: 8px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
}

.ms-checkbox--disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
