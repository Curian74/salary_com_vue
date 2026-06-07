<script setup lang='ts'>
import { ref } from 'vue';


interface MsInputProps {
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean,
    required?: boolean,
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
    <input ref="inputRef" @input="handleInput" :value="modelValue" :disabled="disabled" :placeholder="placeholder"
        :required="required" type="text">
</template>
<style scoped></style>