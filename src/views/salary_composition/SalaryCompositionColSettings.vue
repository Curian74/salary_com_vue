<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { GetGridConfigsResponse, UpdateGridConfigItem } from '@/types/gridConfig';
import MsCheckbox from '@/components/base/MsCheckbox.vue';
import MsButton from '@/components/base/MsButton.vue';
import MsInput from '@/components/base/MsInput.vue';
import configKeys from '@/constants/configs/configKeys';

interface MsColumnCustomizerProps {
    columns: GetGridConfigsResponse[];
}

const props = defineProps<MsColumnCustomizerProps>();
let debounceTimer: ReturnType<typeof setTimeout>;

const emit = defineEmits<{
    save: [payload: { changedColumns: UpdateGridConfigItem[], allColumns: GetGridConfigsResponse[] }];
    close: [];
    searchChange: [string]
}>();

const searchTerm = ref('');
const panelRef = ref<HTMLElement | null>(null);

// Trạng thái nội bộ để user toggle trước khi nhấn Lưu.
const localColumns = ref<GetGridConfigsResponse[]>([]);
// Snapshot ban đầu để so sánh khi lưu.
const originalColumns = ref<GetGridConfigsResponse[]>([]);

// Deep clone columns khi prop thay đổi.
const syncColumns = () => {
    localColumns.value = props.columns.map((col) => ({ ...col }));
    originalColumns.value = props.columns.map((col) => ({ ...col }));
};

watch(() => props.columns, syncColumns, { immediate: true });

const filteredColumns = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();
    if (!term) return localColumns.value;
    return localColumns.value.filter((col) =>
        col.columnName.toLowerCase().includes(term),
    );
});

const handleToggle = (column: GetGridConfigsResponse) => {
    const target = localColumns.value.find((c) => c.fieldKey === column.fieldKey);
    if (target) {
        target.isDisplayed = !target.isDisplayed;
    }
};

const handleSave = () => {
    const changedColumns: UpdateGridConfigItem[] = localColumns.value
        .filter((col) => {
            const original = originalColumns.value.find((o) => o.id === col.id);
            return original && original.isDisplayed !== col.isDisplayed;
        })
        .map((col) => ({
            id: col.id,
            isDisplayed: col.isDisplayed,
            displayOrder: col.displayOrder,
        }));

    emit('save', {
        changedColumns,
        allColumns: localColumns.value.map((col) => ({ ...col })),
    });
};

// Click outside → đóng.
const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as Node | null;
    if (target && panelRef.value && !panelRef.value.contains(target)) {
        emit('close');
    }
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        emit('close');
    }
};

const handleTableColSearchChange = (value: string) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        emit('searchChange', value);
    }, configKeys.DEBOUCE_TIMER);
}

onMounted(() => {
    // Delay để tránh sự kiện click mở panel tự trigger đóng.
    nextTick(() => {
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeydown);
    });
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div ref="panelRef" class="ms-column-customizer">
        <!-- Header -->
        <div class="ms-column-customizer__header">
            <span class="ms-column-customizer__title">Tùy chỉnh cột</span>
        </div>

        <!-- Search -->
        <div class="ms-column-customizer__search">
            <svg class="ms-column-customizer__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
            <MsInput @update:model-value="handleTableColSearchChange" v-model="searchTerm" type="text"
                class="ms-column-customizer__search-input" placeholder="Tìm kiếm" />
        </div>

        <!-- Column list -->
        <ul class="ms-column-customizer__list">
            <li v-for="column in filteredColumns" :key="column.fieldKey" class="ms-column-customizer__item"
                @click="handleToggle(column)">
                <MsCheckbox :checked="column.isDisplayed ?? false" @change="handleToggle(column)" @click.stop />
                <span class="ms-column-customizer__label">{{ column.columnName }}</span>
            </li>

            <li v-if="filteredColumns.length === 0" class="ms-column-customizer__empty">
                Không có dữ liệu
            </li>
        </ul>
        <div class="border-gray-200 border-t mx-4"></div>
        <!-- Footer -->
        <div class="ms-column-customizer__footer">
            <MsButton variant="primary" size="sm" class="ms-column-customizer__save" @click="handleSave">
                Lưu
            </MsButton>
        </div>
    </div>
</template>

<style scoped>
.ms-column-customizer {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 100;
    display: flex;
    width: 380px;
    flex-direction: column;
    border: 1px solid #e2e6ea;
    border-radius: 8px;
    background: #ffffff;
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.10),
        0 1px 4px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

/* ── Header ─────────────────────────────── */
.ms-column-customizer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px 8px;
}

.ms-column-customizer__title {
    font-size: 14px;
    font-weight: 700;
    color: #001b44;
    line-height: 20px;
}

/* ── Search ─────────────────────────────── */
.ms-column-customizer__search {
    position: relative;
    margin: 0 12px 8px;
}

.ms-column-customizer__search-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    width: 15px;
    height: 15px;
    color: #7a828c;
    transform: translateY(-50%);
    pointer-events: none;
}

.ms-column-customizer__search-input {
    width: 100%;
    height: 34px;
    padding: 0 10px 0 32px;
    border: 1px solid #d7dce1;
    border-radius: 6px;
    background: #ffffff;
    color: #001b44;
    font-size: 13px;
    line-height: 34px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ms-column-customizer__search-input::placeholder {
    color: #9ba4ae;
}

.ms-column-customizer__search-input:focus {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.12);
}

/* ── Column list ────────────────────────── */
.ms-column-customizer__list {
    display: flex;
    max-height: 280px;
    flex-direction: column;
    margin: 0;
    padding: 0 4px 4px;
    list-style: none;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.ms-column-customizer__list::-webkit-scrollbar {
    width: 5px;
}

.ms-column-customizer__list::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #c8cfd6;
}

.ms-column-customizer__list::-webkit-scrollbar-track {
    background: transparent;
}

.ms-column-customizer__item {
    display: flex;
    min-height: 34px;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.12s ease;
    user-select: none;
}

.ms-column-customizer__item:hover {
    background: #f3f5f7;
}

.ms-column-customizer__label {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    color: #001b44;
    font-size: 13px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ms-column-customizer__empty {
    padding: 16px 12px;
    color: #7a828c;
    font-size: 13px;
    text-align: center;
}

/* ── Footer ─────────────────────────────── */
.ms-column-customizer__footer {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px 12px;
}

.ms-column-customizer__save {
    min-width: 64px;
    font-weight: 600;
}
</style>
