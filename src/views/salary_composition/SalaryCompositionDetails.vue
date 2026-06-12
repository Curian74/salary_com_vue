<script setup lang="ts">
import MsButton from '@/components/base/MsButton.vue';
import MsIcon from '@/components/base/MsIcon.vue';
import type { GetOrganizationTreeResponse } from '@/types/organization.ts';
import SalaryCompositionForm from './SalaryCompositionForm.vue';
import { onMounted, ref } from 'vue';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';
import type { SalaryCompositionDetail } from '@/types/salaryComposition.ts';
import { getApiErrorMessage } from '@/helpers/apiResponseHelper.ts';

interface Props {
    organizationItems?: GetOrganizationTreeResponse[],
    salaryCompositionId?: string | null;
}

const mode = ref<'edit' | 'view'>('view');

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
                <button type="button" class="flex size-8 cursor-pointer
                 items-center justify-center rounded-full text-[#6b7280]
                 transition hover:bg-[#dadce3] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Quay lại">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                </button>

                <h1 class="truncate text-[20px] font-bold leading-7 text-text-primary">12A5</h1>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <MsButton size="sm" variant="secondary" class="min-w-20">
                    <template #prepend>
                        <MsIcon name="pencil" class="text-[#6b7280]" />
                    </template>
                    Sửa
                </MsButton>

                <MsButton size="md" variant="icon" class="w-10 px-0!" aria-label="Thao tác khác">
                    <MsIcon name="more" class="salary-composition-details__more-icon" />
                </MsButton>
            </div>
        </div>

        <div class="mx-5 min-h-0 flex-1 overflow-hidden bg-white">
            <SalaryCompositionForm :salary-composition="salaryComposition" :mode="mode"
                :organization-items="organizationItems" />
        </div>
    </section>
</template>

<style scoped>
.salary-composition-details__more-icon {
    filter: brightness(0) saturate(100%) invert(43%) sepia(9%) saturate(516%) hue-rotate(176deg) brightness(93%) contrast(88%);
}
</style>
