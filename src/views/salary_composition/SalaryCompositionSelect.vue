<script setup lang='ts'>
import { computed } from 'vue';
import MsMenuSelect from '@/components/base/MsMenuSelect.vue';
import type { MsMenuSelectOption } from '@/components/base/MsMenuSelect.vue';
import type { GetSalaryCompositionsResponse } from '@/types/salaryComposition';

// Định nghĩa kiểu cho option của SalaryCompositionSelect, mở rộng từ MsMenuSelectOption
interface SalaryCompositionOption extends MsMenuSelectOption {
    salaryComposition: GetSalaryCompositionsResponse
}

interface SalaryCompositionSelectProps {
    data: GetSalaryCompositionsResponse[]
    modelValue?: string | number | null
    disabled?: boolean
    invalid?: boolean
    placeholder?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<SalaryCompositionSelectProps>(), {
    data: () => [],
    modelValue: null,
    disabled: false,
    invalid: false,
    placeholder: 'Chọn thành phần lương để hiển thị giá trị',
    isLoading: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    change: [value: string | number | null]
}>();

// Map sang dạng options cho MsMenuSelect
const options = computed<SalaryCompositionOption[]>(() =>
    props.data.map((salaryComposition) => ({
        value: salaryComposition.id,
        label: `${salaryComposition.name} (${salaryComposition.code})`,
        salaryComposition,
    })),
);

// Hàm để lấy tên và mã của thành phần lương từ option
const getSalaryCompositionName = (option: MsMenuSelectOption) =>
    (option as SalaryCompositionOption).salaryComposition.name;

const getSalaryCompositionCode = (option: MsMenuSelectOption) =>
    (option as SalaryCompositionOption).salaryComposition.code;

const handleValueChange = (value: string | number | null) => {
    emit('update:modelValue', value);
    emit('change', value);
};

</script>
<template>
    <MsMenuSelect :model-value="modelValue" :options="options" :disabled="disabled" :invalid="invalid"
        :placeholder="isLoading ? 'Đang tải dữ liệu...' : placeholder"
        :empty-text="isLoading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu'" class="salary-composition-select"
        @update:model-value="handleValueChange">
        <template #option="{ option }">
            <span class="salary-composition-select__option-text">
                {{ getSalaryCompositionName(option) }}
                <strong>({{ getSalaryCompositionCode(option) }})</strong>
            </span>
        </template>
    </MsMenuSelect>
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

:deep(.ms-menu-select__menu) {
    max-height: 380px;
}

:deep(.ms-menu-select__option) {
    min-height: 40px;
    align-items: flex-start;
    padding-bottom: 8px;
    padding-top: 8px;
}
</style>
