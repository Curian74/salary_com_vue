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
    <input ref="checkboxRef" @change="handleChange" :checked="checked" :disabled="disabled" class="size-3 rounded
     border-[#cfd4da] text-primary focus:ring-primary/20
      disabled:cursor-not-allowed disabled:opacity-60" type="checkbox" />
</template>

<style scoped></style>
