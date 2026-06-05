<script setup lang='ts' generic="T">
import { ref, watch } from 'vue';
import DxTreeView from 'devextreme-vue/tree-view';

defineOptions({
    inheritAttrs: false,
})

interface Props {
    items: T[];
    keyExpr?: string; // Key để định danh từng node
    parentIdExpr?: string; // Key để định danh node cha
    displayExpr?: string; // Field hiển thị label lên UI
    selectable?: boolean;
    multiple?: boolean;
    selectedKeys?: string[];
}

interface TreeViewComponentRef {
    instance?: {
        getSelectedNodeKeys: () => unknown[];
        selectItem: (key: string) => void;
        unselectAll: () => void;
    }
}

const props = withDefaults(defineProps<Props>(), {
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    displayExpr: 'text',
    selectable: true,
    multiple: true,
    selectedKeys: () => [],
});

function getItem(data: unknown): T {
    return data as T;
}

const emit = defineEmits<{
    'update:selectedKeys': [string[]]
}>()

const treeViewRef = ref<TreeViewComponentRef | null>(null);
let isSyncingSelection = false;

function areSameKeys(first: string[], second: string[]) {
    if (first.length !== second.length) {
        return false;
    }

    return first.every((key, index) => key === second[index]);
}

function handleSelectionChanged(e: any) {
    if (isSyncingSelection) {
        return;
    }

    emit('update:selectedKeys', e.component.getSelectedNodeKeys().map((key: unknown) => String(key)))
}

watch(
    () => props.selectedKeys,
    (selectedKeys) => {
        const instance = treeViewRef.value?.instance;

        if (!instance) {
            return;
        }

        const normalizedSelectedKeys = selectedKeys.map((key) => String(key));
        const currentSelectedKeys = instance.getSelectedNodeKeys().map((key) => String(key));

        if (areSameKeys(currentSelectedKeys, normalizedSelectedKeys)) {
            return;
        }

        isSyncingSelection = true;

        try {
            instance.unselectAll();

            normalizedSelectedKeys.forEach((key) => {
                instance.selectItem(key);
            });
        }
        finally {
            isSyncingSelection = false;
        }
    },
    { flush: 'post' }
);

</script>
<template>
    <div class="ms-tree-view text-[13px] text-text-primary">
        <DxTreeView ref="treeViewRef" @selection-changed="handleSelectionChanged" v-bind="$attrs"
            :selected-item-keys="selectedKeys" :data-source="items" data-structure="plain" :key-expr="keyExpr"
            :display-expr="displayExpr" :parent-id-expr="parentIdExpr"
            :show-check-boxes-mode="selectable ? 'normal' : 'none'" :selection-mode="multiple ? 'multiple' : 'single'"
            :select-nodes-recursive="multiple" :select-by-click="false" no-data-text="Không có dữ liệu">
            <template #item="slotProps">
                <slot name="item" :item="getItem(slotProps.data)">
                    <span>
                        {{ slotProps.data[displayExpr] }}
                    </span>
                </slot>
            </template>
        </DxTreeView>
    </div>
</template>
<style scoped>
:deep(.dx-treeview .dx-checkbox) {
    line-height: 0;
}

:deep(.dx-treeview .dx-checkbox-container) {
    width: 16px;
    height: 16px;
}

:deep(.dx-treeview .dx-checkbox-icon) {
    position: relative;
    width: 16px;
    height: 16px;
    border: 1px solid #cfd4da;
    border-radius: 4px;
    background: #ffffff;
    color: #ffffff;
    box-sizing: border-box;
    font-size: 0;
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

:deep(.dx-treeview .dx-checkbox-icon::before) {
    content: "";
    display: none;
}

:deep(.dx-treeview .dx-checkbox-icon::after) {
    content: "";
    display: none;
}

:deep(.dx-treeview .dx-checkbox.dx-state-hover .dx-checkbox-icon),
:deep(.dx-treeview .dx-checkbox:hover .dx-checkbox-icon) {
    border-color: var(--app-color-primary);
}

:deep(.dx-treeview .dx-checkbox.dx-state-focused .dx-checkbox-icon),
:deep(.dx-treeview .dx-treeview-item-with-checkbox.dx-state-focused > .dx-treeview-item .dx-checkbox-icon) {
    box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.2);
}

:deep(.dx-treeview .dx-checkbox-checked .dx-checkbox-icon),
:deep(.dx-treeview .dx-checkbox-indeterminate .dx-checkbox-icon) {
    border-color: var(--app-color-primary);
    background: var(--app-color-primary);
}

:deep(.dx-treeview .dx-treeview-node),
:deep(.dx-treeview .dx-treeview-node-container) {
    overflow: visible;
}

:deep(.dx-treeview .dx-treeview-item) {
    position: relative;
    overflow: visible;
    background-color: transparent !important;
    box-shadow: none;
}

:deep(.dx-treeview .dx-treeview-item-content),
:deep(.dx-treeview .dx-treeview-toggle-item-visibility),
:deep(.dx-treeview .dx-checkbox) {
    position: relative;
    z-index: 1;
}

:deep(.dx-treeview .dx-treeview-node.dx-state-selected > .dx-treeview-item) {
    background-color: var(--app-color-focus) !important;
    box-shadow:
        -100vw 0 0 100vw var(--app-color-focus),
        100vw 0 0 100vw var(--app-color-focus);
    color: var(--app-color-primary);
    font-weight: 500;
}

:deep(.dx-treeview .dx-treeview-node.dx-state-selected.dx-state-hover > .dx-treeview-item) {
    background-color: #cdeadf !important;
    box-shadow:
        -100vw 0 0 100vw #cdeadf,
        100vw 0 0 100vw #cdeadf;
}

:deep(.dx-treeview .dx-treeview-node.dx-state-hover:not(.dx-state-selected) > .dx-treeview-item) {
    background-color: #f8f9fb !important;
    box-shadow:
        -100vw 0 0 100vw #f8f9fb,
        100vw 0 0 100vw #f8f9fb;
}

:deep(.dx-treeview .dx-treeview-node.dx-state-selected > .dx-treeview-item *) {
    color: inherit !important;
}

:deep(.dx-treeview .dx-checkbox-checked .dx-checkbox-icon::after) {
    content: "";
    display: block;
    position: absolute;
    top: 1px;
    left: 5px;
    width: 5px;
    height: 9px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    z-index: 1;
}

:deep(.dx-treeview .dx-checkbox-indeterminate .dx-checkbox-icon::after) {
    content: "";
    display: block;
    position: absolute;
    top: 6px;
    left: 3px;
    width: 8px;
    height: 2px;
    border-radius: 999px;
    background: #ffffff;
    z-index: 1;
}

:deep(.dx-treeview .dx-state-disabled .dx-checkbox-icon),
:deep(.dx-treeview .dx-checkbox.dx-state-disabled .dx-checkbox-icon) {
    opacity: 0.6;
}
</style>
