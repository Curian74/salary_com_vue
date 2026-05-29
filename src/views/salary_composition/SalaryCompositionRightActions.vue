<script setup lang='ts'>
import MsButton from '@/components/base/MsButton.vue';
import MsIcon from '@/components/base/MsIcon.vue';

</script>
<template>
    <div class="ml-auto flex items-center gap-2">
        <MsButton size="sm" variant="icon" type="button" aria-label="Thiết lập bảng">
            <MsIcon name="table-filter" />
        </MsButton>
        <MsButton size="sm" variant="icon" type="button" aria-label="Thiết lập bảng">
            <MsIcon name="table-settings" />
        </MsButton>
    </div>
</template>
<style scoped></style>