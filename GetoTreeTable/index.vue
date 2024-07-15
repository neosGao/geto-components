<!--
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-15 15:25:45
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-11-15 16:13:04
 * @FilePath: \sys-web\src\geto-components\GetoTreeTable\index.vue
 * @Description: 树+表格组件
 *
 * Copyright (c) gwj, All Rights Reserved.
-->
<template>
  <div>
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <GetoTree
          ref="inTree"
          :title="props.treeTitle"
          :data="props.treeData"
          :config="props.treeConfig"
          @handleNodeClick="handleNodeClick"
          @handleCheckChange="handleCheckChange"
        />
      </template>
      <template #paneR>
        <!-- 自定义右侧面板的内容 -->
        <GetoTable
          ref="inTable"
          :config="props.tableConfig"
          :page="props.tablePage"
          :initDataConfig="props.tableInitDataConfig"
          :tableFunction="props.tableFunction"
          @handleSelectionChange="handleSelectionChange"
          @onHighLightClick="onHighLightClick"
          @handleRowClick="handleRowClick"
          @tableCurrentChange="tableCurrentChange"
          @handleRowDblclick="handleRowDblclick"
        >
          <template v-slot:button-row>
            <!-- 插槽 -->
            <slot name="button-row" />
          </template>
          <template v-slot:dropdownSlotMenuItem>
            <slot name="dropdownSlotMenuItem" />
          </template>
          <template v-slot:column="scope">
            <slot name="column" :scope="scope" />
          </template>
          <template v-slot:rowExpand="scope">
            <slot name="rowExpand" :scope="scope" />
          </template>
          <template v-slot:operate_column>
            <slot name="operate_column" />
          </template>
        </GetoTable>
      </template>
    </splitpane>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";

defineOptions({
  name: "GetoTreeTable"
});

const emits = defineEmits([
  "onHighLightClick",
  "selectionChange",
  "handleRowClick",
  "tableCurrentChange",
  "handleRowDblclick",
  "handleNodeClick",
  "handleCheckChange"
]); // 定义发射给父组件的事件

const inTree = ref(null);
const inTable = ref(null);

const props = defineProps({
  treeData: {
    type: Array<any>,
    default: () => []
  },
  treeTitle: {
    type: String,
    default: () => ""
  },
  treeConfig: {
    type: Object,
    default: () => {}
  },
  tableConfig: {
    type: Array<any>,
    default: () => []
  },
  tablePage: {
    type: Object,
    default: () => {}
  },
  tableInitDataConfig: {
    type: Object,
    default: () => {}
  },
  tableFunction: {
    type: Object,
    default: () => {}
  }
});
//-------------------------------------------------------------------------树组件方法开始
const handleNodeClick = data => {
  emits("handleNodeClick", data);
};
const handleCheckChange = (data, check) => {
  emits("handleCheckChange", data, check);
};
//-------------------------------------------------------------------------树组件方法结束
//-------------------------------------------------------------------------表格组件方法开始
const handleSelectionChange = selection => {
  emits("selectionChange", selection);
};
const onHighLightClick = (row, item) => {
  emits("onHighLightClick", row, item);
};
const handleRowClick = (row, column, event) => {
  emits("handleRowClick", row, column, event);
};
const tableCurrentChange = val => {
  emits("tableCurrentChange", val);
};
const handleRowDblclick = (row, column, event) => {
  emits("handleRowDblclick", row, column, event);
};
//-------------------------------------------------------------------------表格组件方法结束
defineExpose({
  // 暴露出两个子组件，再调用方法
  inTree,
  inTable
});

const settingLR: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 15,
  split: "vertical"
});
</script>
