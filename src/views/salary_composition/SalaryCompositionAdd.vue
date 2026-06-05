<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import MsButton from '@/components/base/MsButton.vue';
import MsInput from '@/components/base/MsInput.vue';
import MsSelect, { type MsSelectOption } from '@/components/base/MsSelect.vue';
import MsTreeView from '@/components/base/MsTreeView.vue';

interface OrganizationOption {
    id: string
    parentId: string | null
    name: string
    hasChildren?: boolean
}

const router = useRouter();

const organizationDropdownRef = ref<HTMLElement | null>(null);
const isOrganizationDropdownOpen = ref(false);
const selectedOrganizationIds = ref<string[]>(['phuc-lam']);

const compositionType = ref(null);
const nature = ref('income');
const valueType = ref('money');

const compositionTypeOptions: MsSelectOption[] = [
    { value: null, label: '' },
    { value: 'income', label: 'Thu nhập' },
    { value: 'deduction', label: 'Khấu trừ' },
    { value: 'contribution', label: 'Đóng góp' },
];

const natureOptions: MsSelectOption[] = [
    { value: 'income', label: 'Thu nhập' },
    { value: 'deduction', label: 'Khấu trừ' },
];

const valueTypeOptions: MsSelectOption[] = [
    { value: 'money', label: 'Tiền tệ' },
    { value: 'number', label: 'Số' },
    { value: 'percent', label: 'Phần trăm' },
];

const valueScopeOptions: MsSelectOption[] = [
    { value: 'same-unit', label: 'Trong cùng đơn vị công tác' },
    { value: 'all-units', label: 'Tất cả đơn vị' },
];

const sourceOptions: MsSelectOption[] = [
    { value: 'manual', label: 'Tự thêm' },
];

const organizationItems: OrganizationOption[] = [
    { id: 'phuc-lam', parentId: null, name: 'Công ty Phúc Lâm', hasChildren: true },
    { id: 'sales', parentId: 'phuc-lam', name: 'Phòng Kinh doanh' },
    { id: 'accounting', parentId: 'phuc-lam', name: 'Phòng Kế toán' },
    { id: 'hr', parentId: 'phuc-lam', name: 'Phòng Nhân sự' },
];

const toggleOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = !isOrganizationDropdownOpen.value;
};

const closeOrganizationDropdown = () => {
    isOrganizationDropdownOpen.value = false;
};

const updateSelectedOrganizationIds = (ids: string[]) => {
    selectedOrganizationIds.value = ids;
};

const handleDocumentPointerDown = (event: PointerEvent) => {
    const target = event.target as Node | null;

    if (target && organizationDropdownRef.value?.contains(target)) {
        return;
    }

    closeOrganizationDropdown();
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeOrganizationDropdown();
    }
};

const goBack = () => {
    router.push({ name: 'SalaryCompositionList' });
};

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
});

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
            <div class="salary-add-scroll h-full overflow-y-auto px-12 pb-22 pt-5">
                <form class="salary-add-form" @submit.prevent>
                    <label class="salary-add-label" for="composition-name">
                        Tên thành phần <span class="text-error">*</span>
                    </label>
                    <MsInput id="composition-name" class="salary-add-input" />

                    <label class="salary-add-label" for="composition-code">
                        Mã thành phần <span class="text-error">*</span>
                    </label>
                    <MsInput id="composition-code" class="salary-add-input" placeholder="Nhập mã viết liền" />

                    <label class="salary-add-label">
                        Đơn vị áp dụng <span class="text-error">*</span>
                    </label>
                    <div ref="organizationDropdownRef" class="relative">
                        <button type="button"
                            class="salary-add-field flex w-full items-center justify-between gap-2 px-2"
                            :aria-expanded="isOrganizationDropdownOpen" @click="toggleOrganizationDropdown">
                            <span class="inline-flex min-w-0 items-center gap-1">
                                <span class="inline-flex h-6.5 max-w-70 items-center gap-1 rounded-lg border border-[#d0d5dd]
                                 bg-[#f8f9fb] px-2 text-[13px] font-semibold text-[#001b44]">
                                    <span class="truncate">Công ty Phúc Lâm</span>
                                    <svg class="size-4 shrink-0 text-[#5f6673]" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" aria-hidden="true">
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </span>
                            </span>

                            <svg class="size-4 shrink-0 text-text-secondary transition-transform"
                                :class="isOrganizationDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        <div v-if="isOrganizationDropdownOpen" class="absolute left-0 top-full z-10000 mt-1 w-full overflow-hidden
                         rounded-lg border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
                            <MsTreeView :items="organizationItems" :selected-keys="selectedOrganizationIds"
                                key-expr="id" parent-id-expr="parentId" display-expr="name"
                                class="max-h-64 overflow-auto py-1"
                                @update:selected-keys="updateSelectedOrganizationIds">
                                <template #item="{ item }">
                                    <span class="block truncate" :class="item.hasChildren ? 'font-medium' : ''">
                                        {{ item.name }}
                                    </span>
                                </template>
                            </MsTreeView>
                        </div>
                    </div>

                    <label class="salary-add-label" for="composition-type">
                        Loại thành phần <span class="text-error">*</span>
                    </label>
                    <MsSelect id="composition-type" v-model="compositionType" :options="compositionTypeOptions"
                        class="salary-add-select salary-add-select--medium" />

                    <label class="salary-add-label" for="nature">
                        Tính chất <span class="text-error">*</span>
                    </label>
                    <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
                        <MsSelect id="nature" v-model="nature" :options="natureOptions"
                            class="salary-add-select salary-add-select--medium" />

                        <label class="salary-add-radio">
                            <input type="radio" name="tax-status" checked>
                            <span>Chịu thuế</span>
                        </label>

                        <label class="salary-add-radio">
                            <input type="radio" name="tax-status">
                            <span>Miễn thuế toàn phần</span>
                        </label>

                        <label class="salary-add-radio">
                            <input type="radio" name="tax-status">
                            <span>Miễn thuế một phần</span>
                        </label>
                    </div>

                    <label class="salary-add-label" for="limit">Định mức</label>
                    <textarea id="limit" class="salary-add-textarea h-22"
                        placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>

                    <div></div>
                    <label class="flex h-7 items-center gap-2.5 text-[13px] text-[#001b44]">
                        <input type="checkbox" class="size-4 rounded border-[#cfd4da] accent-primary">
                        <span>Cho phép giá trị tính vượt quá định mức</span>
                        <span class="inline-flex size-5 items-center justify-center rounded-full border border-[#7d8591]
                         text-[13px] font-bold text-[#6b7280]">i</span>
                    </label>

                    <label class="salary-add-label" for="value-type">Kiểu giá trị</label>
                    <MsSelect id="value-type" v-model="valueType" :options="valueTypeOptions"
                        class="salary-add-select salary-add-select--medium" />

                    <label class="salary-add-label">Giá trị</label>
                    <div class="flex flex-col gap-3">
                        <label class="salary-add-radio">
                            <input type="radio" name="value-method">
                            <span>Tự động cộng tổng giá trị của các nhân viên</span>
                        </label>

                        <MsSelect model-value="same-unit" :options="valueScopeOptions"
                            class="salary-add-select salary-add-select--medium" />

                        <label class="salary-add-radio">
                            <input type="radio" name="value-method" checked>
                            <span>Tính theo công thức tự đặt</span>
                        </label>

                        <div class="relative max-w-262">
                            <textarea class="salary-add-textarea h-22"
                                placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>
                        </div>
                    </div>

                    <label class="salary-add-label" for="description">Mô tả</label>
                    <textarea id="description" class="salary-add-textarea h-22"></textarea>

                    <label class="salary-add-label">Hiển thị trên phiếu lương</label>
                    <div class="flex flex-wrap items-center gap-6">
                        <label class="salary-add-radio">
                            <input type="radio" name="show-on-payroll" checked>
                            <span>Có</span>
                        </label>

                        <label class="salary-add-radio">
                            <input type="radio" name="show-on-payroll">
                            <span>Không</span>
                        </label>

                        <label class="salary-add-radio">
                            <input type="radio" name="show-on-payroll">
                            <span>Chỉ hiển thị nếu giá trị khác 0</span>
                        </label>
                    </div>

                    <label class="salary-add-label" for="source">Nguồn tạo</label>
                    <MsSelect id="source" model-value="manual" :options="sourceOptions" disabled
                        class="salary-add-select salary-add-select--medium" />
                </form>
            </div>
        </div>

        <div class="flex h-13 shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-3">
            <MsButton class="min-w-25" variant="secondary" @click="goBack">Hủy bỏ</MsButton>
            <MsButton class="min-w-32 border border-primary bg-white! text-primary! shadow-none! hover:bg-focus!"
                variant="secondary">
                Lưu và thêm
            </MsButton>
            <MsButton class="min-w-25" variant="primary">Lưu</MsButton>
        </div>
    </section>
</template>

<style scoped>
.salary-add-form {
    display: grid;
    grid-template-columns: 220px minmax(320px, 1048px);
    column-gap: 30px;
    row-gap: 14px;
    align-items: start;
}

.salary-add-label {
    min-height: 34px;
    display: flex;
    align-items: center;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-add-field,
.salary-add-input,
.salary-add-textarea {
    min-height: 34px;
    border: 1px solid #cfd4da;
    border-radius: 8px;
    background: #ffffff;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.salary-add-input {
    width: 80%;
    padding: 0 9px;
}

.salary-add-textarea {
    width: 80%;
    resize: vertical;
    padding: 8px 12px;
}

.salary-add-input::placeholder,
.salary-add-textarea::placeholder {
    color: #c5cad1;
}

.salary-add-field:hover,
.salary-add-input:hover,
.salary-add-textarea:hover {
    border-color: #aab2bd;
}

.salary-add-field:focus,
.salary-add-input:focus,
.salary-add-textarea:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

.salary-add-select {
    width: 100%;
}

.salary-add-select--medium {
    max-width: 394px;
}

.salary-add-select :deep(select) {
    width: 100%;
    min-width: 0;
    height: 34px;
    border-color: #cfd4da;
    font-size: 13px;
    color: #001b44;
}

.salary-add-radio {
    display: inline-flex;
    min-height: 20px;
    align-items: center;
    gap: 8px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-add-radio input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--app-color-primary);
}

.salary-add-scroll {
    scrollbar-gutter: stable;
}

@media (max-width: 900px) {
    .salary-add-form {
        grid-template-columns: 1fr;
        row-gap: 10px;
    }

    .salary-add-label {
        min-height: auto;
        padding-top: 8px;
    }
}
</style>
