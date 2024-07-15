<template>
  <div class="geto-edit-table">
    <div class="mb-2">
      <!-- 按钮插槽 -->
      <slot name="button" :tableData="tableData" :selectionRows="selectionRows" />
    </div>
    <el-table
      v-bind="$attrs"
      ref="getoTable"
      :data="tableData"
      :height="props.tableConfig.height || '100%'"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
      :span-method="props?.tableFunction?.spanMethod || (() => {})"
      :show-summary="props?.tableFunction?.showSummary || false"
      :summary-method="props?.tableFunction?.summaryMethod || (() => {})"
    >
      <el-table-column type="expand" fixed="left" v-if="tableConfig.useExpand">
        <template v-slot="scope">
          <slot name="rowExpand" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50"
        align="center"
        fixed="left"
        :selectable="props?.tableFunction?.selectable || (() => true)"
        v-if="tableConfig.selection"
      />
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
          <template #header>
            <slot name="tableLabel" :item="item" v-if="item.label_slot" />
            <span> <span style="color: red" v-if="item.require">*</span>{{ item.label }} </span>
          </template>
          <template v-slot="{ row, $index }">
            <slot name="tableItem" :row="row" :item="item" :key="$index" v-if="item.use_slot" />
            <span
              v-else-if="
                (item.readonly || props.tableConfig.readonly || row.readonly) && !item.use_slot
              "
            >
              {{
                item.type === "select"
                  ? item.options.filter(v => v.value === row[item.value])[0].label
                  : row[item.value]
              }}
            </span>
            <!-- <el-input v-model="row[item.value]" v-else /> -->
            <GetoInputItem
              v-else
              ref="inputItem"
              :config="item"
              :initRows="row"
              :initIndex="$index"
              :initData="row[item.value]"
              :disabled="!!row[`${item.value}Disabled`] || props.disabled"
              @setData="setData"
              @changeData="(rows, config) => changeData(rows, config, row, item, $index)"
              @blurData="(rows, config) => blurData(rows, config, row, item, $index)"
              @onSearchInput="config => onSearchInput(config, row, item, $index)"
              @remoteMethod="(query, config) => remoteMethod(query, config, row, item, $index)"
            />
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import GetoInputItem from "../GetoInputItem/index.vue";

defineOptions({
  name: "GetoEditTable",
  inheritAttrs: false // 防止父组件的属性被默认继承
});

const emits = defineEmits([
  "selectionChange",
  "cellClick",
  "changeData",
  "blurData",
  "onSearchInput",
  "remoteMethod"
]); // 定义发射给父组件的事件

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

const selectionRows = ref([]);

const getoTable = ref(null);

const toggleRowExpansion = (row, expanded) => {
  getoTable.value.toggleRowExpansion(row, expanded);
};

const doLayout = () => {
  getoTable.value.doLayout();
};

const handleSelectionChange = selection => {
  selectionRows.value = selection;
  emits("selectionChange", selection);
};

const handleCellClick = (row, column, cell, event) => {
  const obj = { row, column, cell, event };
  emits("cellClick", obj);
};

const inputItem = ref(null);

const onEditInput = () => {
  const params = inputItem.value[0].onEditInput();
  return params;
};

const setData = (row, index, data) => {
  if (index === -1) return;
  tableData.value[index][row] = data;
};

const changeData = (rows, config, row, item, $index) => {
  emits("changeData", rows, config, row, item, $index);
};

const blurData = (rows, config, row, item, $index) => {
  emits("blurData", rows, config, row, item, $index);
};

const getTable = () => {
  return tableData.value;
};

const setTable = data => {
  tableData.value = data;
};

const onSearchInput = (config, row, item, $index) => {
  emits("onSearchInput", config, row, item, $index);
};

const remoteMethod = (query, config, row, item, $index) => {
  emits("remoteMethod", query, config, row, item, $index);
};

interface CustomValidate {
  [key: string]: (value: any, callback: any) => void;
}

const validate = async (customValidate?: CustomValidate) => {
  return tableData.value.every(row => {
    return props.config.every(item => {
      if (item.require && row[item.value] === "") {
        const msg = item.label + "不能为空";
        ElMessage.error(msg);
        throw new Error(msg);
      }
      // 自定义校验规则
      if (customValidate && customValidate[item.value]) {
        customValidate[item.value](row[item.value], (msg: string) => {
          if (msg) {
            ElMessage.error(msg);
            throw new Error(msg);
          }
        });
      }

      return true;
    });
  });
};

defineExpose({
  // 暴露出子组件方法
  onEditInput,
  toggleRowExpansion,
  doLayout,
  getoTable,
  getTable,
  setTable,
  validate
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
