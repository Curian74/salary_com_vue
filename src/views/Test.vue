<template>
    <div class="container" style="padding: 20px;">
        <h2>Demo TreeView Multi-Select (TypeScript)</h2>
        <div style="width: 400px;">
            <TreeSelect :nodes="treeData" :model-value="selectedIds" :expanded-keys="expandedKeys"
                @update:model-value="selectedIds = $event" @toggle-expand="toggleExpand" />
        </div>

        <div class="preview-box" style="margin-top: 20px; padding: 10px; background: #f9f9f9;">
            <strong>Dữ liệu v-model hiện tại:</strong>
            <pre>{{ selectedIds }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TreeSelect from '@/components/base/tree_view/TreeSelect.vue';
import type { TreeNodeItem } from '@/types/treeNode';

interface DemoTreeItem {
    id: string;
    name: string;
    children?: DemoTreeItem[];
}

function toTreeNode(item: DemoTreeItem): TreeNodeItem<DemoTreeItem> {
    return {
        id: item.id,
        name: item.name,
        raw: item,
        children: item.children?.map(toTreeNode) ?? [],
    };
}

function getAllNodeIds(nodes: TreeNodeItem<DemoTreeItem>[]): string[] {
    return nodes.flatMap((node) => [
        node.id,
        ...getAllNodeIds(node.children ?? []),
    ]);
}

const selectedIds = ref<string[]>([]);

const treeData = ref<TreeNodeItem<DemoTreeItem>[]>([
    toTreeNode({
        id: '1',
        name: 'Phòng Công Nghệ',
        children: [
            {
                id: '2',
                name: 'Nhóm Web Backend',
                children: [
                    { id: '4', name: 'Team .NET Core' },
                    { id: '5', name: 'Team Node.js' }
                ]
            },
            { id: '3', name: 'Nhóm Frontend (Vue/React)' }
        ]
    }),
    toTreeNode({
        id: '6',
        name: 'Phòng Nhân Sự',
        children: [
            { id: '7', name: 'Tuyển dụng' },
            { id: '8', name: 'Truyền thông nội bộ' }
        ]
    }),
]);

const expandedKeys = ref(new Set(getAllNodeIds(treeData.value)));

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
</script>
