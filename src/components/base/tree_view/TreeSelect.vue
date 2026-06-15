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

</script>

<template>
    <div class="ms-tree-select">
        <TreeNode v-for="node in nodes" :key="node.id" :node="node" :model-value="modelValue"
            :expanded-keys="expandedKeys" :selectable="selectable" :multiple="multiple"
            @update:model-value="emit('update:modelValue', $event)" @toggle-expand="emit('toggle-expand', $event)">

            <template #item="{ item }">
                <slot name="item" :item="item" />
            </template>
        </TreeNode>
    </div>
</template>
