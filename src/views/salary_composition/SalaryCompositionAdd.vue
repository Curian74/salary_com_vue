<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionForm from './SalaryCompositionForm.vue';
import {
    TrackingStatus,
} from '@/enums/salaryCompositionEnums';
import type { GetOrganizationTreeResponse } from '@/types/organization';
import type { CreateSalaryCompositionRequest } from '@/types/salaryComposition.ts';
import salaryCompositionApi from '@/apis/salaryCompositionApi.ts';

const router = useRouter();

const organizationItems: GetOrganizationTreeResponse[] = [
    {
        id: 'phuc-lam',
        parentId: '',
        name: 'Công ty Phúc Lâm',
        trackingStatus: TrackingStatus.Active,
        hasChildren: true,
        children: [
            {
                id: 'sales',
                parentId: 'phuc-lam',
                name: 'Phòng Kinh doanh',
                trackingStatus: TrackingStatus.Active,
                hasChildren: false,
            },
            {
                id: 'accounting',
                parentId: 'phuc-lam',
                name: 'Phòng Kế toán',
                trackingStatus: TrackingStatus.Active,
                hasChildren: false,
            },
            {
                id: 'hr',
                parentId: 'phuc-lam',
                name: 'Phòng Nhân sự',
                trackingStatus: TrackingStatus.Active,
                hasChildren: false,
            },
        ],
    },
];

const goBack = () => {
    router.push({ name: 'SalaryCompositionList' });
};

const handleSubmit = async (payload: CreateSalaryCompositionRequest) => {
    console.log(payload);
    try {
        const data = await salaryCompositionApi.createSalaryComposition(payload);
        console.log(data);
        alert("ngon");
    }

    catch (err) {
        console.log(err);
        alert("haiz");
    }
};

// Ref để gọi phương thức submitForm của SalaryCompositionForm
const formRef = ref<InstanceType<typeof SalaryCompositionForm>>();


</script>

<template>
    <section class="flex h-[calc(100vh-48px)] flex-col bg-background">
        <div class="flex h-15 shrink-0 items-center gap-3 px-7">
            <button type="button" class="flex size-8 items-center justify-center rounded-lg text-[#6b7280]
             transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" aria-label="Quay lại"
                @click="goBack">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
            </button>

            <h1 class="text-[22px] font-bold leading-7 text-text-primary">Thêm thành phần</h1>
        </div>

        <div class="mx-5 min-h-0 flex-1 overflow-hidden bg-white">
            <!-- Gắn ref cho form để có thể gọi phương thức submitForm -->
            <SalaryCompositionForm ref="formRef" @submit="handleSubmit" @cancel="goBack" mode="create" />
        </div>

        <div class="flex h-13 shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-3">
            <MsButton class="min-w-25" variant="secondary" @click="goBack">Hủy bỏ</MsButton>
            <MsButton class="min-w-32 border border-primary bg-white! text-primary! shadow-none! hover:bg-focus!"
                variant="secondary">
                Lưu và thêm
            </MsButton>
            <MsButton class="min-w-25" variant="primary" @click="formRef?.submitForm()">Lưu</MsButton>
        </div>
    </section>
</template>
