<script setup lang="ts" generic="T">
import { computed } from 'vue';
import type { Slot } from 'vue';
import TreeNode from './TreeNode.vue';
import type { TreeNodeItem } from '@/types/treeNode';

defineProps<{
    nodes: TreeNodeItem<T>[];
    modelValue: string[];
    expandedKeys: Set<string>;
    selectable?: boolean;
    multiple?: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [string[]];
    'toggle-expand': [string];
}>();

const slots = defineSlots<{
    item?: (props: { item: T }) => any;
}>();

const itemSlot = computed<Slot<{ item: unknown }> | undefined>(() => {
    if (!slots.item) {
        return undefined;
    }

    return ((slotProps: { item: unknown }) =>
        slots.item?.(slotProps as { item: T }) ?? []) as Slot<{ item: unknown }>;
});
</script>

<template>
    <div class="ms-tree-select">
        <TreeNode v-for="node in nodes" :key="node.id" :node="node" :model-value="modelValue"
            :expanded-keys="expandedKeys" :item-slot="itemSlot" :selectable="selectable" :multiple="multiple"
            @update:model-value="emit('update:modelValue', $event)" @toggle-expand="emit('toggle-expand', $event)" />
    </div>
</template>
