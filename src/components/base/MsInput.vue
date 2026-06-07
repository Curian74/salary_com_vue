<script setup lang='ts'>

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

</script>
<template>
    <input @input="handleInput" :value="modelValue" :disabled="disabled" :placeholder="placeholder" :required="required"
        type="text">
</template>
<style scoped></style>