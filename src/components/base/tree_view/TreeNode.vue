<script setup lang="ts">
import { computed } from 'vue';
import type { Slot, VNodeChild } from 'vue';
import MsCheckbox from '../MsCheckbox.vue';
import type { TreeNodeItem } from '@/types/treeNode';

const props = withDefaults(defineProps<{
    node: TreeNodeItem;
    modelValue: string[];
    expandedKeys: Set<string>;
    itemSlot?: Slot<{ item: unknown }>;
    depth?: number;
    selectable?: boolean;
    multiple?: boolean;
}>(), {
    depth: 0,
    selectable: true,
    multiple: true,
    expandedKeys: () => new Set<string>(),
});

const emit = defineEmits<{
    'update:modelValue': [string[]];
    'toggle-expand': [string];
}>();

const TreeNodeItemContent = (contentProps: {
    itemSlot?: Slot<{ item: unknown }>;
    item: unknown;
    name: string;
}): VNodeChild => contentProps.itemSlot?.({ item: contentProps.item }) ?? contentProps.name;

const hasChildren = computed(() => !!props.node.children?.length);
const isExpanded = computed(() => props.expandedKeys.has(props.node.id));

function getAllIds(node: TreeNodeItem): string[] {
    return [
        node.id,
        ...(node.children ?? []).flatMap(getAllIds),
    ];
}

const allIds = computed(() => getAllIds(props.node));

const isChecked = computed(() =>
    allIds.value.every((id) => props.modelValue.includes(id))
);

const isIndeterminate = computed(() => {
    const selectedCount = allIds.value.filter((id) => props.modelValue.includes(id)).length;

    return selectedCount > 0 && selectedCount < allIds.value.length;
});

function onCheckboxChange(checked: boolean) {
    if (!props.multiple) {
        emit('update:modelValue', checked ? [props.node.id] : []);
        return;
    }

    const next = new Set(props.modelValue);

    allIds.value.forEach((id) => {
        if (checked) {
            next.add(id);
        }
        else {
            next.delete(id);
        }
    });

    emit('update:modelValue', Array.from(next));
}
</script>

<template>
    <div class="ms-tree-node">
        <div class="ms-tree-node__row" :class="{ 'ms-tree-node__row--selected': isChecked }"
            :style="{ paddingLeft: `${depth * 20}px` }">
            <button v-if="hasChildren" type="button" class="ms-tree-node__toggle"
                @click="emit('toggle-expand', node.id)">
                {{ isExpanded ? '▼' : '▶' }}
            </button>

            <span v-else class="ms-tree-node__toggle"></span>

            <MsCheckbox v-if="selectable" class="ms-tree-node__checkbox" :checked="isChecked"
                :indeterminate="isIndeterminate" @change="onCheckboxChange" />

            <div class="ms-tree-node__content">
                <TreeNodeItemContent :item-slot="itemSlot" :item="node.raw" :name="node.name" />
            </div>
        </div>

        <div v-if="hasChildren && isExpanded">
            <TreeNode v-for="child in node.children" :key="child.id" :node="child" :model-value="modelValue"
                :expanded-keys="expandedKeys" :item-slot="itemSlot" :depth="depth + 1" :selectable="selectable"
                :multiple="multiple" @update:model-value="emit('update:modelValue', $event)"
                @toggle-expand="emit('toggle-expand', $event)" />
        </div>
    </div>
</template>
