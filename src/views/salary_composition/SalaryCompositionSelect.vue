<script setup lang='ts'>
import MsMenuSelect from '@/components/base/MsMenuSelect.vue';
import type { GetSalaryCompositionsResponse } from '@/types/salaryComposition';


interface SalaryCompositionSelectProps {
    data: GetSalaryCompositionsResponse[]
}

const props = withDefaults(defineProps<SalaryCompositionSelectProps>(), {
    data: () => [],
});

</script>
<template>
    <MsMenuSelect>

    </MsMenuSelect>
</template>
<style scoped></style>