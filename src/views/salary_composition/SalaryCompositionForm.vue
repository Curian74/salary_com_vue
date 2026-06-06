<script setup lang="ts">
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsInput from '@/components/base/MsInput.vue';
import MsSelect from '@/components/base/MsSelect.vue';
</script>

<template>
    <div class="salary-composition-form-scroll h-full overflow-y-auto px-12 pb-22 pt-5">
        <form class="salary-composition-form">
            <label class="salary-composition-form__label" for="composition-name">
                Tên thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsInput id="composition-name" class="salary-composition-form__input" />
            </div>

            <label class="salary-composition-form__label" for="composition-code">
                Mã thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsInput id="composition-code" class="salary-composition-form__input" placeholder="Nhập mã viết liền" />
            </div>

            <label class="salary-composition-form__label">
                Đơn vị áp dụng <span class="text-error">*</span>
            </label>
            <div class="relative">
                <button type="button"
                    class="salary-composition-form__field flex w-full items-center justify-between gap-2 px-2">
                    <span class="truncate text-text-placeholder">Đơn vị áp dụng</span>

                    <svg class="size-4 shrink-0 text-text-secondary transition-transform" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
            </div>

            <label class="salary-composition-form__label" for="composition-type">
                Loại thành phần <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <MsSelect id="composition-type" :model-value="null" :options="[
                    { value: null, label: '' },
                    { value: 1, label: 'Thu nhập' },
                    { value: 2, label: 'Khấu trừ' },
                    { value: 3, label: 'Phúc lợi' },
                ]" class="salary-composition-form__select salary-composition-form__select--medium" />
            </div>

            <label class="salary-composition-form__label" for="nature">
                Tính chất <span class="text-error">*</span>
            </label>
            <div class="salary-composition-form__control">
                <div class="flex flex-wrap items-center gap-x-7 gap-y-2">
                    <MsSelect id="nature" :model-value="1" :options="[
                        { value: 1, label: 'Cộng vào lương' },
                        { value: 2, label: 'Trừ vào lương' },
                    ]" class="salary-composition-form__select salary-composition-form__select--medium" />

                    <label class="salary-composition-form__radio">
                        <input type="radio" name="tax-status">
                        <span>Chịu thuế</span>
                    </label>

                    <label class="salary-composition-form__radio">
                        <input type="radio" name="tax-status">
                        <span>Miễn thuế toàn phần</span>
                    </label>

                    <label class="salary-composition-form__radio">
                        <input type="radio" name="tax-status">
                        <span>Miễn thuế một phần</span>
                    </label>
                </div>
            </div>

            <label class="salary-composition-form__label" for="limit">Định mức</label>
            <textarea id="limit" class="salary-composition-form__textarea h-22"
                placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>

            <div></div>
            <div class="flex h-7 items-center gap-2.5 text-[13px] text-[#001b44]">
                <MsCheckbox />
                <span>Cho phép giá trị tính vượt quá định mức</span>
                <span class="inline-flex size-5 items-center justify-center rounded-full border border-[#7d8591]
                         text-[13px] font-bold text-[#6b7280]">i</span>
            </div>

            <label class="salary-composition-form__label" for="value-type">Kiểu giá trị</label>
            <div class="salary-composition-form__control">
                <MsSelect id="value-type" :model-value="1" :options="[
                    { value: 1, label: 'Số tiền' },
                    { value: 2, label: 'Công thức' },
                    { value: 3, label: 'Tỷ lệ' },
                ]" class="salary-composition-form__select salary-composition-form__select--medium" />
            </div>

            <label class="salary-composition-form__label">Giá trị</label>
            <div class="flex flex-col gap-3">
                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method">
                    <span>Tự động cộng tổng giá trị của các nhân viên</span>
                </label>

                <MsSelect :model-value="1" :options="[
                    { value: 1, label: 'Tất cả nhân viên' },
                    { value: 2, label: 'Nhân viên được chọn' },
                ]" class="salary-composition-form__select salary-composition-form__select--medium" />

                <label class="salary-composition-form__radio">
                    <input type="radio" name="value-method">
                    <span>Tính theo công thức tự đặt</span>
                </label>

                <div class="relative max-w-262">
                    <textarea class="salary-composition-form__textarea h-22"
                        placeholder="Tự động gợi ý công thức và tham số khi gõ"></textarea>
                </div>
            </div>

            <label class="salary-composition-form__label" for="description">Mô tả</label>
            <textarea id="description" class="salary-composition-form__textarea h-22"></textarea>

            <label class="salary-composition-form__label">Hiển thị trên phiếu lương</label>
            <div class="salary-composition-form__control">
                <div class="flex flex-wrap items-center gap-6">
                    <label class="salary-composition-form__radio">
                        <input type="radio" name="show-on-payroll">
                        <span>Có</span>
                    </label>

                    <label class="salary-composition-form__radio">
                        <input type="radio" name="show-on-payroll">
                        <span>Không</span>
                    </label>

                    <label class="salary-composition-form__radio">
                        <input type="radio" name="show-on-payroll">
                        <span>Chỉ hiển thị nếu giá trị khác 0</span>
                    </label>
                </div>
            </div>

            <label class="salary-composition-form__label" for="source">Nguồn tạo</label>
            <MsSelect id="source" :model-value="1" :options="[
                { value: 1, label: 'Tự tạo' },
            ]" disabled class="salary-composition-form__select salary-composition-form__select--medium" />
        </form>
    </div>
</template>

<style scoped>
.salary-composition-form {
    display: grid;
    grid-template-columns: 220px minmax(320px, 1048px);
    column-gap: 30px;
    row-gap: 14px;
    align-items: start;
}

.salary-composition-form__label {
    min-height: 34px;
    display: flex;
    align-items: center;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-form__control {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
}

.salary-composition-form__field,
.salary-composition-form__input,
.salary-composition-form__textarea {
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

.salary-composition-form__field:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.salary-composition-form__input,
.salary-composition-form__textarea {
    width: 80%;
}

.salary-composition-form__input {
    padding: 0 9px;
}

.salary-composition-form__textarea {
    resize: vertical;
    padding: 8px 12px;
}

.salary-composition-form__input::placeholder,
.salary-composition-form__textarea::placeholder {
    color: #c5cad1;
}

.salary-composition-form__field:hover,
.salary-composition-form__input:hover,
.salary-composition-form__textarea:hover {
    border-color: #aab2bd;
}

.salary-composition-form__field:focus,
.salary-composition-form__input:focus,
.salary-composition-form__textarea:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

.salary-composition-form__select {
    width: 100%;
}

.salary-composition-form__select--medium {
    max-width: 394px;
}

.salary-composition-form__select :deep(select) {
    width: 100%;
    min-width: 0;
    height: 34px;
    border-color: #cfd4da;
    font-size: 13px;
    color: #001b44;
}

.salary-composition-form__radio {
    display: inline-flex;
    min-height: 20px;
    align-items: center;
    gap: 8px;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
}

.salary-composition-form__radio input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--app-color-primary);
}

.salary-composition-form-scroll {
    scrollbar-gutter: stable;
}

@media (max-width: 900px) {
    .salary-composition-form {
        grid-template-columns: 1fr;
        row-gap: 10px;
    }

    .salary-composition-form__label {
        min-height: auto;
        padding-top: 8px;
    }
}
</style>
