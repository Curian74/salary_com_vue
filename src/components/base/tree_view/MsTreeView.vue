<script setup lang='ts' generic="T">
import { computed, ref, watch } from 'vue';
import TreeSelect from './TreeSelect.vue';
import type { TreeNodeItem } from '@/types/treeNode';

defineOptions({
    inheritAttrs: false,
})

interface Props {
    items: T[];
    keyExpr?: string;
    parentIdExpr?: string;
    displayExpr?: string;
    selectable?: boolean;
    multiple?: boolean;
    selectedKeys?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    displayExpr: 'text',
    selectable: true,
    multiple: true,
    selectedKeys: () => [],
});

const emit = defineEmits<{
    'update:selectedKeys': [string[]]
}>()

defineSlots<{
    item?: (props: { item: T }) => any;
}>();

const expandedKeys = ref<Set<string>>(new Set());

function getValue(item: T, expr: string): unknown {
    return (item as Record<string, unknown>)[expr];
}

function toTreeNode(item: T): TreeNodeItem<T> {
    const children = ((item as { children?: T[] }).children ?? []);

    return {
        id: String(getValue(item, props.keyExpr)),
        name: String(getValue(item, props.displayExpr) ?? ''),
        raw: item,
        children: children.map(toTreeNode),
    };
}

const treeNodes = computed(() => props.items.map(toTreeNode));

function getAllNodeIds(nodes: TreeNodeItem<T>[]): string[] {
    return nodes.flatMap((node) => [
        node.id,
        ...getAllNodeIds(node.children ?? []),
    ]);
}

watch(
    treeNodes,
    (nodes) => {
        expandedKeys.value = new Set(getAllNodeIds(nodes));
    },
    { immediate: true }
);

function toggleExpand(id: string) {
    const next = new Set(expandedKeys.value);

    if (next.has(id)) {
        next.delete(id);
    }
    else {
        next.add(id);
    }

    expandedKeys.value = next;
}

function updateSelectedKeys(keys: string[]) {
    if (!props.multiple) {
        emit('update:selectedKeys', keys.slice(-1));
        return;
    }

    emit('update:selectedKeys', keys);
}

const instance = {
    getSelectedNodeKeys: () => props.selectedKeys,

    selectItem: (key: string) => {
        updateSelectedKeys(Array.from(new Set([...props.selectedKeys, key])));
    },

    unselectAll: () => {
        updateSelectedKeys([]);
    },

    collapseAll: () => {
        expandedKeys.value = new Set();
    },

    expandAll: () => {
        expandedKeys.value = new Set(getAllNodeIds(treeNodes.value));
    },
};

defineExpose({ instance });
</script>

<template>
    <div class="ms-tree-view text-[13px] text-text-primary" v-bind="$attrs">
        <div v-if="treeNodes.length === 0" class="px-4 py-3 text-text-placeholder">
            Không có dữ liệu
        </div>

        <TreeSelect v-else :nodes="treeNodes" :model-value="selectedKeys" :expanded-keys="expandedKeys"
            :selectable="selectable" :multiple="multiple" @update:model-value="updateSelectedKeys"
            @toggle-expand="toggleExpand">
            <template #item="{ item }">
                <slot name="item" :item="item">
                    {{ (item as Record<string, unknown>)[displayExpr] }}
                </slot>
            </template>
        </TreeSelect>
    </div>
</template>

<style scoped>
:deep(.ms-tree-node__row) {
    min-height: 38px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 12px;
    color: var(--app-color-text-primary);
}

:deep(.ms-tree-node__row:hover) {
    background-color: #f8f9fb;
}

:deep(.ms-tree-node__row--selected) {
    background-color: var(--app-color-focus);
    color: var(--app-color-primary);
    font-weight: 500;
}

:deep(.ms-tree-node__row--selected:hover) {
    background-color: #cdeadf;
}

:deep(.ms-tree-node__toggle) {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 0;
    background: transparent;
    color: var(--app-color-icon);
    cursor: pointer;
    font-size: 10px;
    line-height: 16px;
}

:deep(.ms-tree-node__checkbox) {
    width: 16px;
    height: 16px;
    margin: 0;
    flex-shrink: 0;
    accent-color: var(--app-color-primary);
}

:deep(.ms-tree-node__content) {
    min-width: 0;
    flex: 1;
}
</style>
