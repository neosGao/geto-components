<template>
  <div class="geto-tree flex flex-col">
    <h3 v-if="title">{{ title }}</h3>
    <el-input
      v-model="searchValue"
      placeholder="模糊查询"
      clearable
      @input="filterSearch"
    >
      <template #suffix>
        <el-icon class="el-input__icon">
          <IconifyIconOffline
            v-show="searchValue.length === 0"
            :icon="Search"
          />
        </el-icon>
      </template>
    </el-input>
    <el-divider style="margin: 10px 0" />
    <el-tree
      class="filter-tree flex-1 overflow-y-scroll"
      v-bind="$attrs"
      ref="treeRef"
      :data="props.data"
      :props="treeProps"
      :node-key="config.nodeKey ?? 'id'"
      :default-expand-all="config.expandAll"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check="handleCheckChange"
      :show-checkbox="config.showCheckbox"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Search from "@iconify-icons/ep/search";

defineOptions({
  name: "GetoTree",
  inheritAttrs: false // 防止父组件的属性被默认继承
});
const emits = defineEmits(["handleNodeClick", "handleCheckChange"]); // 定义发射给父组件的事件

const treeRef = ref();
const searchValue = ref("");

const props = defineProps({
  data: {
    type: Array<any>,
    default: () => []
  },
  title: {
    type: String,
    default: () => ""
  },
  config: {
    type: Object,
    default: () => {}
  }
});

const treeProps = {
  children: "children",
  label: props.config.treePropsLabel ?? "label"
};

const filterSearch = val => {
  treeRef.value.filter(val);
};

const filterNode = (value, data) => {
  if (!value) return true;
  return data[treeProps.label].includes(value);
};
const handleNodeClick = data => {
  emits("handleNodeClick", data);
};
const handleCheckChange = (data, check) => {
  emits("handleCheckChange", data, check);
};
const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false));
};
const resetTree = () => {
  treeRef.value!.setCheckedKeys([], false);
};
const setChecked = item => {
  treeRef.value!.setChecked(item, false, false);
};
defineExpose({
  // 暴露出子组件方法
  getCheckedNodes,
  resetTree,
  setChecked
});
</script>

<style lang="scss" scoped>
.geto-tree {
  width: 100%;
  height: calc(100% - 10px);
  color: rgba($color: dodgerblue, $alpha: 80%);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  padding: 10px 0;
}
</style>
