<script setup lang="ts">
import { computed } from 'vue';

export interface MsSelectOption {
    value: string | number | null
    label: string
    disabled?: boolean
}

interface MsSelectProps {
    modelValue: string | number | null
    options: MsSelectOption[]
    disabled?: boolean
}

const props = withDefaults(defineProps<MsSelectProps>(), {
    disabled: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    change: [value: string | number | null]
}>();

const selectedValue = computed(() => String(props.modelValue ?? ''));

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedOption = props.options.find((option) => String(option.value ?? '') === target.value);
    const value = selectedOption?.value ?? null;

    emit('update:modelValue', value);
    emit('change', value);
};

</script>

<template>
    <div class="relative inline-flex">
        <select :value="selectedValue" :disabled="disabled" class="h-9 min-w-23 appearance-none
         rounded-lg border border-border bg-white
            py-0 pl-3 pr-8 text-[14px] font-normal text-text-primary shadow-sm outline-none transition
            cursor-pointer hover:bg-[#f8f9fb] focus:border-primary focus:ring-2 focus:ring-primary/20
            disabled:cursor-not-allowed disabled:opacity-60" @change="handleChange">
            <option v-for="option in options" :key="String(option.value)" :value="String(option.value ?? '')"
                :disabled="option.disabled">
                {{ option.label }}
            </option>
        </select>

        <svg class="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    </div>
</template>

<style scoped></style>
