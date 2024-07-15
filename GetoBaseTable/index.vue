<template>
  <div class="w-full h-full">
    <el-table
      header-cell-class-name="table-header"
      class="tableHeight"
      ref="tableRef"
      :data="data"
      size="small"
      border
    >
      <!-- 单选 -->
      <el-table-column width="50" v-if="isSingle" align="center">
        <template #default="scope">
          <el-radio
            v-model="radio"
            :label="scope.$index"
            size="large"
            @change="handleRadioChange"
            >{{ "" }}
          </el-radio>
        </template>
      </el-table-column>
      <!-- 多选 -->
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="isMultiple"
      />
      <!-- index -->
      <el-table-column
        type="index"
        width="50"
        v-if="showIndex"
        align="center"
      />

      <base-column
        v-for="(column, index) in props.columns"
        :key="index"
        :column="column"
      >
        <template #custom="scope">
          <slot
            name="custom"
            :row="scope.row"
            :key="scope.key"
            :index="scope.index"
          />
        </template>
      </base-column>
      <!-- 自定义列 插槽 -->
      <slot name="tableColumn" />
    </el-table>

    <div class="flex justify-end" v-if="pagination">
      <el-pagination
        class="mt-2"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="pagheSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import { ElTable } from "element-plus";
import { BaseTableProps } from "./type";
import BaseColumn from "./column.vue";

defineOptions({
  name: "BaseTable"
});

const props = defineProps(BaseTableProps);
const emits = defineEmits(["selection-change", "page-change"]);

const tableRef = ref<InstanceType<typeof ElTable>>();

// 禁用时不展示选择框
const isSingle = computed(
  () => !props.disabled && props.selection && !props.multiple
);
const isMultiple = computed(
  () => !props.disabled && props.selection && props.multiple
);
const showIndex = computed(() => props.showIndex);

const radio = ref<number>(undefined);

const handleRadioChange = value => {
  const row = props.data[value];
  emits("selection-change", value, row);
};
const getSelectionValue = () => {
  return radio.value;
};
const clearSelectionValue = () => {
  if (isSingle.value) {
    radio.value = undefined;
  } else {
    tableRef.value?.clearSelection();
  }
};
const getMultipleRows = () => {
  return tableRef.value?.getSelectionRows();
};

const currentPage = ref<number>(props.currentPage);
const pageSize = ref<number>(props.pageSize);

const currentChange = value => {
  currentPage.value = value;
  emits("page-change", {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  });
};
const pagheSizeChange = value => {
  pageSize.value = value;
  emits("page-change", {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  });
};

// 设置选中行
const setSelection = (row: any, selected: boolean) => {
  if (isSingle.value) {
    radio.value = row;
  } else {
    tableRef.value?.toggleRowSelection(row, selected);
  }
};

defineExpose({
  getSelectionValue,
  getMultipleRows,
  setSelection,
  clearSelectionValue
});
</script>
<style lang="scss" scope>
::v-deep(.el-radio__label) {
  padding-left: 0;
}
::v-deep(.el-radio.el-radio--large) {
  height: 0;
}
.tableHeight {
  height: calc(100% - 52px);
  overflow: hidden;
}
</style>
