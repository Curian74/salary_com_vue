<script setup lang='ts'>
import { ref } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsIcon from '@/components/base/MsIcon.vue';
import type { GetGridConfigsResponse } from '@/types/gridConfig';
import SalaryCompositionColSettings from './SalaryCompositionColSettings.vue';

interface SalaryCompositionRightActionsProps {
    columns: GetGridConfigsResponse[];
}

defineProps<SalaryCompositionRightActionsProps>();

const emit = defineEmits<{
    'save-columns': [columns: GetGridConfigsResponse[]];
    searchChange: [string];
}>();

const isColumnCustomizerOpen = ref(false);

const toggleColumnCustomizer = () => {
    isColumnCustomizerOpen.value = !isColumnCustomizerOpen.value;
};

const closeColumnCustomizer = () => {
    isColumnCustomizerOpen.value = false;
};

const handleSaveColumns = (columns: GetGridConfigsResponse[]) => {
    emit('save-columns', columns);
    closeColumnCustomizer();
};

const handleTableColSearchChange = (value: string) => {
    emit('searchChange', value);
}

</script>

<template>
    <div class="ml-auto flex items-center gap-2">
        <MsButton size="sm" variant="icon" type="button" aria-label="Thiết lập bảng">
            <MsIcon name="table-filter" />
        </MsButton>
        <div class="relative">
            <MsButton size="sm" variant="icon" type="button" aria-label="Tùy chỉnh cột" @pointerdown.stop
                @click="toggleColumnCustomizer">
                <MsIcon name="table-settings" />
            </MsButton>
            <SalaryCompositionColSettings @search-change="handleTableColSearchChange($event)"
                v-if="isColumnCustomizerOpen" :columns="columns" @save="handleSaveColumns"
                @close="closeColumnCustomizer" />
        </div>
    </div>
</template>

<style scoped></style>