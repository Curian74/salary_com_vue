<script setup lang="ts">
import { ref } from 'vue';
import SalaryCompositionAdd from './SalaryCompositionAdd.vue';
import SalaryCompositionList from './SalaryCompositionList.vue';

type SalaryCompositionView = 'list' | 'add' | 'edit' | 'view';

const activeView = ref<SalaryCompositionView>('list');
const selectedSalaryCompositionId = ref<string | null>(null);
const listKey = ref(0);

const showList = (shouldRefresh = false) => {
    activeView.value = 'list';
    selectedSalaryCompositionId.value = null;

    if (shouldRefresh) {
        listKey.value++;
    }
};

const showAdd = () => {
    activeView.value = 'add';
    selectedSalaryCompositionId.value = null;
};

const handleSaved = () => {
    showList(true);
};
</script>

<template>
    <SalaryCompositionList v-if="activeView === 'list'" :key="listKey" @add="showAdd" />

    <SalaryCompositionAdd v-else-if="activeView === 'add'" @back="showList()" @saved="handleSaved" />

    <section v-else class="flex h-[calc(100vh-48px)] flex-col bg-background px-4 pb-2.5 pt-3">
        <div class="text-[20px] font-bold leading-8 text-text-primary">
            {{ activeView === 'edit' ? 'Sửa thành phần lương' : 'Chi tiết thành phần lương' }}
        </div>
        <span class="hidden">{{ selectedSalaryCompositionId }}</span>
    </section>
</template>
