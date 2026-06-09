<script setup lang="ts">
import { ref } from 'vue';
import MsButton from '@/components/base/MsButton.vue';
import MsPopup from '@/components/base/MsPopup.vue';
import SalaryCompositionForm from './SalaryCompositionForm.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import type { CreateSalaryCompositionRequest, GetSalaryCompositionsResponse } from '@/types/salaryComposition.ts';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';

type SubmitAction = 'save' | 'saveAndAdd';

interface Props {
    organizationItems?: GetOrganizationTreeResponse[],
    salaryComposition?: GetSalaryCompositionsResponse[],
}

const props = defineProps<Props>();

const emit = defineEmits<{
    back: []
    saved: []
}>();

const formRef = ref<InstanceType<typeof SalaryCompositionForm>>();
const formKey = ref(0);
const isSaving = ref(false);
const isLeaveConfirmOpen = ref(false);
const submitAction = ref<SubmitAction>('save');

const goBack = () => {
    if (formRef.value?.checkFormDirty()) {
        isLeaveConfirmOpen.value = true;
        return;
    }

    emit('back');
};

const closeLeaveConfirm = () => {
    isLeaveConfirmOpen.value = false;
};

const confirmLeave = () => {
    isLeaveConfirmOpen.value = false;
    emit('back');
};

const handleSubmit = async (payload: CreateSalaryCompositionRequest) => {
    console.log(payload);

    try {
        isSaving.value = true;

        const data = await salaryCompositionApi.createSalaryComposition(payload);
        alert('ngon');

        if (submitAction.value === 'saveAndAdd') {
            formKey.value++;
            return;
        }

        emit('saved');
    }
    catch (err) {
        console.log(err);
        alert('haiz');
    }
    finally {
        isSaving.value = false;
    }
};

const handleSave = () => {
    submitAction.value = 'save';
    formRef.value?.submitForm();
};

const handleSaveAndAdd = () => {
    submitAction.value = 'saveAndAdd';
    formRef.value?.submitForm();
};

</script>

<template>
    <section class="flex h-[calc(100vh-48px)] flex-col bg-background">
        <div class="flex h-15 shrink-0 items-center gap-3 px-7">
            <button type="button" class="flex size-8 cursor-pointer
             items-center justify-center rounded-full text-[#6b7280]
             transition hover:bg-[#dadce3] focus:outline-none focus:ring-2 focus:ring-primary/20" aria-label="Quay lại"
                @click="goBack">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
            </button>

            <h1 class="text-[20px] font-bold leading-7 text-text-primary">Thêm thành phần</h1>
        </div>

        <div class="mx-5 min-h-0 flex-1 overflow-hidden bg-white">
            <SalaryCompositionForm :salary-composition="salaryComposition" :key="formKey" ref="formRef"
                :organization-items="organizationItems" @submit="handleSubmit" mode="create" />
        </div>

        <div class="flex h-13 shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-3">
            <MsButton size="sm" class="min-w-20" variant="secondary" :disabled="isSaving" @click="goBack">
                Hủy bỏ
            </MsButton>
            <MsButton size="sm"
                class="min-w-28 border border-primary bg-white! text-primary! shadow-none! hover:bg-focus!"
                variant="secondary" :loading="isSaving && submitAction === 'saveAndAdd'" @click="handleSaveAndAdd">
                Lưu và thêm
            </MsButton>
            <MsButton class="min-w-20" size="sm" variant="primary" :loading="isSaving && submitAction === 'save'"
                @click="handleSave">
                Lưu
            </MsButton>
        </div>

        <MsPopup :open="isLeaveConfirmOpen" @close="closeLeaveConfirm">
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
    </section>
</template>
