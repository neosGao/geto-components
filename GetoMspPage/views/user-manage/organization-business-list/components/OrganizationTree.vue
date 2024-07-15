<template>
  <div class="geto-tree">
    <div class="mb-1">
      <span class="tag-text">组织类型：</span>

      <el-input
        :value="businessTypeName"
        v-if="props.businessTypeName"
        readonly
      />
      <el-input v-else placeholder="请先同步数据" readonly />
    </div>

    <div class="mb-1">
      <span class="tag-text">显示包含下级内容：</span>
      <el-switch
        v-model="isDisplayLowerLevel"
        @change="changeDisplayLowerLevel"
        :active-value="1"
        :inactive-value="0"
      />
    </div>

    <span class="tag-text">当前选中：</span>

    <el-input
      style="flex: 2"
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
      ref="treeRef"
      class="filter-tree"
      :data="props.data"
      :props="treeProps"
      :node-key="config.nodeKey ?? 'id'"
      :filter-node-method="filterNode"
      :default-expanded-keys="props.expandedData"
      @node-click="handleNodeClick"
      @check="handleCheckChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Search from "@iconify-icons/ep/search";
import { bool, string } from "vue-types";

defineOptions({
  name: "GetoTree"
});
const emits = defineEmits([
  "handleNodeClick",
  "handleCheckChange",
  "handleDisplayLowerLevelChange"
]); // 定义发射给父组件的事件

const treeRef = ref();
const searchValue = ref("");
const isDisplayLowerLevel = ref(0);

const props = defineProps({
  businessTypeName: {
    type: string,
    default: () => ""
  },
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
  },
  expandedData: {
    type: Array,
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

const changeDisplayLowerLevel = () => {
  emits("handleDisplayLowerLevelChange", isDisplayLowerLevel.value);
};

const getCheckedNodes = () => {
  treeRef.value!.getCheckedNodes(false, false);
};
const resetTree = () => {
  isDisplayLowerLevel.value = 0;
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
  margin: 10px 0;
}

.tag-text {
  font-size: 14px;
  color: #909399;
}
</style>
