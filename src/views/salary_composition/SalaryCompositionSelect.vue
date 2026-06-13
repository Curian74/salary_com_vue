<script setup lang="ts">
import { computed } from 'vue';
import MsCombobox from '@/components/base/MsCombobox.vue';
import type { MsComboboxOption } from '@/components/base/MsCombobox.vue';
import type { GetSalaryCompositionsResponse } from '@/types/salaryComposition';

interface SalaryCompositionOption extends MsComboboxOption {
    salaryComposition: GetSalaryCompositionsResponse
}

interface SalaryCompositionSelectProps {
    data: GetSalaryCompositionsResponse[]
    modelValue?: string | number | null
    disabled?: boolean
    invalid?: boolean
    placeholder?: string
    isLoading?: boolean
    hasMore?: boolean
}

const props = withDefaults(defineProps<SalaryCompositionSelectProps>(), {
    data: () => [],
    modelValue: null,
    disabled: false,
    invalid: false,
    placeholder: 'Chọn thành phần lương để hiển thị giá trị',
    isLoading: false,
    hasMore: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    change: [value: string | number | null]
    loadMore: []
    search: [query: string]
}>();

const options = computed<SalaryCompositionOption[]>(() =>
    props.data.map((salaryComposition) => ({
        value: salaryComposition.id,
        label: `${salaryComposition.name}`,
        salaryComposition,
    })),
);

const getSalaryCompositionName = (option: MsComboboxOption) =>
    (option as SalaryCompositionOption).salaryComposition.name;

const getSalaryCompositionCode = (option: MsComboboxOption) =>
    (option as SalaryCompositionOption).salaryComposition.code;

const handleValueChange = (value: string | number | null) => {
    emit('update:modelValue', value);
    emit('change', value);
};
</script>

<template>
    <MsCombobox searchable :allow-lazy-load="true" :model-value="modelValue" :options="options" :disabled="disabled"
        :invalid="invalid" :placeholder="placeholder" empty-text="Không có dữ liệu" :is-loading="isLoading"
        :has-more="hasMore" class="salary-composition-select" @update:model-value="handleValueChange"
        @search="emit('search', $event)" @scroll-end="emit('loadMore')">
        <template #option="{ option }">
            <span class="salary-composition-select__option-text">
                {{ getSalaryCompositionName(option) }}
                <strong>({{ getSalaryCompositionCode(option) }})</strong>
            </span>
        </template>
    </MsCombobox>
</template>

<style scoped>
.salary-composition-select {
    width: 100%;
}

.salary-composition-select__option-text {
    min-width: 0;
    white-space: normal;
    word-break: break-word;
}

:deep(.ms-combobox__menu) {
    max-height: 280px;
}

:deep(.ms-combobox__option) {
    min-height: 40px;
    align-items: flex-start;
    padding-bottom: 8px;
    padding-top: 8px;
}
</style>
