<script setup lang="ts" generic="T">// 1. THÊM generic="T" ở đây để đồng bộ với TreeSelect
import { computed } from 'vue';
import MsCheckbox from '../MsCheckbox.vue';
import type { TreeNodeItem } from '@/types/treeNode';
import MsIcon from '../MsIcon.vue';

const props = withDefaults(defineProps<{
    node: TreeNodeItem<T>; // 2. THÊM <T> vào đây để báo định dạng dữ liệu mã hóa dữ liệu gốc
    modelValue: string[];
    expandedKeys: Set<string>;
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

const slots = defineSlots<{
    item?: (props: { item: T }) => any;
}>();

const hasChildren = computed(() => !!props.node.children?.length);
const isExpanded = computed(() => props.expandedKeys.has(props.node.id));

function getAllIds(node: TreeNodeItem<T>): string[] {
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
                <MsIcon v-if="!isExpanded" name="chevron-right"></MsIcon>
                <MsIcon class="ml-1.5" v-if="isExpanded" name="chevron-down"></MsIcon>
            </button>

            <span v-else class="ms-tree-node__toggle"></span>

            <MsCheckbox v-if="selectable" class="ms-tree-node__checkbox" :checked="isChecked"
                :indeterminate="isIndeterminate" @change="onCheckboxChange" />

            <div class="ms-tree-node__content">
                <slot name="item" :item="node.raw">
                    {{ node.name }}
                </slot>
            </div>
        </div>

        <div v-if="hasChildren && isExpanded">
            <TreeNode v-for="child in node.children" :key="child.id" :node="child" :model-value="modelValue"
                :expanded-keys="expandedKeys" :depth="depth + 1" :selectable="selectable" :multiple="multiple"
                @update:model-value="emit('update:modelValue', $event)" @toggle-expand="emit('toggle-expand', $event)">

                <template #item="{ item }">
                    <slot name="item" :item="item" />
                </template>
            </TreeNode>
        </div>
    </div>
</template>