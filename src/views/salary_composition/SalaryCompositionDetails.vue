<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import MsIcon from '@/components/base/MsIcon.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import SalaryCompositionForm from './SalaryCompositionForm.vue';
import { onMounted, ref } from 'vue';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import type { SalaryCompositionDetail } from '@/types/salaryComposition.ts';
import { getApiErrorMessage } from '@/helpers/apiResponseHelper.ts';
import MsTooltip from '@/components/base/MsTooltip.vue';
import SalaryFormExitPopup from './popup/SalaryFormExitPopup.vue';

interface Props {
    organizationItems?: GetOrganizationTreeResponse[],
    salaryCompositionId?: string | null;
}

const mode = ref<'edit' | 'view'>('view');
const formRef = ref<InstanceType<typeof SalaryCompositionForm>>();
const formKey = ref(0);
const isSaving = ref(false);
const isLeaveConfirmOpen = ref(false);

const emit = defineEmits<{
    back: []
    saved: []
}>();

const props = withDefaults(defineProps<Props>(), {
    organizationItems: () => [],
});

const salaryComposition = ref<SalaryCompositionDetail>();

const getById = async () => {
    if (props.salaryCompositionId) {
        try {
            const data = await salaryCompositionApi.getById(props.salaryCompositionId);
            salaryComposition.value = data.value;
        }
        catch (err) {
            const errMsg = getApiErrorMessage(err);
            alert(errMsg);
        }
    }
}

const toggleEditMode = () => {
    mode.value = mode.value === 'edit' ? 'view' : 'edit';
}

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

onMounted(async () => {
    if (props.salaryCompositionId) {
        await getById();
    }
});

</script>

<template>
    <section class="flex h-[calc(100vh-48px)] flex-col bg-background">
        <div class="flex h-15 shrink-0 items-center justify-between px-7">
            <div class="flex min-w-0 items-center gap-3">
                <MsTooltip :show-arrow="true" content="Quay lại">
                    <MsButton variant="ghost" @click="goBack" type="button" class="flex size-8 cursor-pointer
                        items-center justify-center rounded-full text-[#6b7280]
                        transition hover:bg-[#dadce3] focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <MsIcon name="arrow-left">
                        </MsIcon>
                    </MsButton>
                </MsTooltip>

                <h1 class="truncate text-[20px] font-bold leading-7 text-text-primary">
                    {{ salaryComposition?.name }}
                </h1>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <template v-if="mode === 'view'">
                    <MsButton @click="toggleEditMode" size="sm" variant="secondary" class="min-w-20">
                        <template #prepend>
                            <MsIcon name="pencil" class="text-[#6b7280]" />
                        </template>
                        Sửa
                    </MsButton>
                </template>

                <template v-else>
                    <MsButton @click="toggleEditMode" size="sm" variant="secondary" class="min-w-20">
                        Hủy bỏ
                    </MsButton>

                    <MsButton size="sm" variant="primary" class="min-w-20">
                        Lưu
                    </MsButton>
                </template>

                <MsTooltip :show-arrow="true" content="Chức năng khác">
                    <MsButton size="sm" variant="icon" class="w-10 px-0!" aria-label="Thao tác khác">
                        <MsIcon name="threedot" class="salary-composition-details__more-icon" />
                    </MsButton>
                </MsTooltip>
            </div>
        </div>

        <div class="mx-5 min-h-0 flex-1 overflow-hidden bg-white">
            <SalaryCompositionForm ref="formRef" :salary-composition="salaryComposition" :mode="mode"
                :organization-items="organizationItems" />
        </div>

        <SalaryFormExitPopup :confirm-leave="confirmLeave" :open="isLeaveConfirmOpen"
            :close-leave-confirm="closeLeaveConfirm">
        </SalaryFormExitPopup>

    </section>
</template>

<style scoped>
.salary-composition-details__more-icon {
    filter: brightness(0) saturate(100%) invert(43%) sepia(9%) saturate(516%) hue-rotate(176deg) brightness(93%) contrast(88%);
}
</style>
