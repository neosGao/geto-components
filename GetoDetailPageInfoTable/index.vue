<template>
  <div class="geto-edit-table">
    <el-table
      v-bind="$attrs"
      ref="infoTable"
      :data="tableData"
      border
      style="width: 100%"
      @cell-click="handleCellClick"
      :span-method="props?.tableFunction?.spanMethod || (() => {})"
    >
      <el-table-column
        type="index"
        align="center"
        width="80"
        label="序号"
        v-if="tableConfig.index"
      />
      <template v-for="(item, index) in props.config" :key="index">
        <el-table-column
          :prop="item.value"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          v-if="item.display ?? true"
          :align="item.align || 'center'"
        >
          <template v-slot="{ row }">
            <span>
              {{ row[item.value] }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

defineOptions({
  name: "GetoDetailPageInfoTable",
  inheritAttrs: false // 防止父组件的属性被默认继承
});

const emits = defineEmits(["cellClick"]); // 定义发射给父组件的事件

const props = defineProps({
  tableConfig: {
    type: Object,
    default: () => {}
  },
  config: {
    type: Array<any>,
    default: () => []
  },
  data: {
    type: Array<any>,
    default: () => []
  },
  tableFunction: {
    type: Object,
    default: () => {}
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
});

const infoTable = ref(null);

const handleCellClick = (row, column, cell, event) => {
  const obj = { row, column, cell, event };
  emits("cellClick", obj);
};

const getTable = () => {
  return tableData.value;
};

defineExpose({
  // 暴露出子组件方法
  infoTable,
  getTable
});

const tableData = ref(props.data);

watch(props, val => {
  tableData.value = val.data;
});
</script>

<style scope lang="scss">
.geto-edit-table {
  background-color: #fff;
  // padding: 20px;
  border-radius: 4px;
  flex: 1;
}
</style>
