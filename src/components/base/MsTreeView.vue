<script setup lang='ts' generic="T">
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
}

const props = withDefaults(defineProps<Props>(), {
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    displayExpr: 'text',
    selectable: true,
    multiple: true,
});

</script>
<template>
    <div class="ms-tree-view text-[13px] text-text-primary">
        <DxTreeView v-bind="$attrs" :data-source="items" data-structure="plain" :key-expr="keyExpr"
            :display-expr="displayExpr" :parent-id-expr="parentIdExpr"
            :show-check-boxes-mode="selectable ? 'normal' : 'none'" :selection-mode="multiple ? 'multiple' : 'single'"
            :select-nodes-recursive="multiple" :select-by-click="false" no-data-text="Không có dữ liệu">
            <template #item="item">
                <slot name="item" :item="item.data">
                    <span class="truncate">{{ item.data?.[displayExpr] }}</span>
                </slot>
            </template>
        </DxTreeView>
    </div>
</template>
<style scoped></style>
