<script setup lang='ts'>

interface MsInputProps {
    placeholder?: string;
    value?: string;
    disabled?: boolean,
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
    <input @input="handleInput" :value="value" :disabled="disabled" :placeholder="placeholder" type="text">
</template>
<style scoped></style>