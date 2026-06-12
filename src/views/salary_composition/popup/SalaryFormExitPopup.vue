<script setup lang='ts'>
import MsButton from '@/components/base/MsButton.vue';
import MsPopup from '@/components/base/MsPopup.vue';

interface Props {
    open: boolean;
    closeLeaveConfirm: () => void;
    confirmLeave: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
});

</script>
<template>
    <MsPopup :open="open" @close="closeLeaveConfirm">
        <template #title>Thoát và không lưu?</template>

        <p>Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.</p>

        <template #footer>
            <MsButton size="sm" variant="secondary" class="min-w-20 font-medium" @click="closeLeaveConfirm">
                Ở lại
            </MsButton>
            <MsButton size="sm" variant="primary" class="min-w-20 font-medium" @click="confirmLeave">
                Thoát, không lưu
            </MsButton>
        </template>
    </MsPopup>
</template>
<style scoped></style>