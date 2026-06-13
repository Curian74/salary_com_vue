<script setup lang='ts'>
import { ref } from 'vue';


interface MsInputProps {
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean,
    required?: boolean,
    readonly?: boolean,
}

const props = defineProps<MsInputProps>();

const emit = defineEmits([
    'update:modelValue'
])

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
    focus: () => inputRef.value?.focus(),
})

</script>
<template>
    <input :readonly="readonly" ref="inputRef" @input="handleInput" :value="modelValue" :disabled="disabled"
        :placeholder="placeholder" :required="required" type="text"
        class="disabled:bg-[#f5f5f5] disabled:text-text-placeholder disabled:cursor-not-allowed">
</template>

<style scoped></style>