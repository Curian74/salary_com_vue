<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MsButton from '@/components/base/MsButton.vue';
import SalaryCompositionForm from './SalaryCompositionForm.vue';
import {
    AutoSumEmployeeType,
    CompositionNature,
    IncomeTaxType,
    SourceType,
    TrackingStatus,
    ValueType,
} from '@/enums/salaryCompositionEnums';
import type { GetOrganizationTreeResponse } from '@/types/organization';
import type { SalaryCompositionFormModel } from '@/types/salaryComposition';

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

const formData = ref<SalaryCompositionFormModel>({
    name: '',
    code: '',
    organizationIds: ['phuc-lam'],
    compositionType: null,
    compositionNature: CompositionNature.Income,
    incomeTaxType: IncomeTaxType.Taxable,
    quotaFormula: '',
    allowToExceedQuota: false,
    valueType: ValueType.Currency,
    isAutoSumEmployee: false,
    autoSumEmployeeType: AutoSumEmployeeType.SameWorkingUnit,
    valueFormula: '',
    description: '',
    optionShowPaycheck: 1,
    sourceType: SourceType.UserAdded,
});

const goBack = () => {
    router.push({ name: 'SalaryCompositionList' });
};

const handleSave = () => {
};

const handleSaveAndAdd = () => {
};
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
            <SalaryCompositionForm v-model="formData" mode="create" :organization-items="organizationItems"
                @submit="handleSave" />
        </div>

        <div class="flex h-13 shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-3">
            <MsButton class="min-w-25" variant="secondary" @click="goBack">Hủy bỏ</MsButton>
            <MsButton class="min-w-32 border border-primary bg-white! text-primary! shadow-none! hover:bg-focus!"
                variant="secondary" @click="handleSaveAndAdd">
                Lưu và thêm
            </MsButton>
            <MsButton class="min-w-25" variant="primary" @click="handleSave">Lưu</MsButton>
        </div>
    </section>
</template>
