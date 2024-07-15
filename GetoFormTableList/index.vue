<template>
  <div class="table-list" v-loading="_table.options.loading">
    <div class="pb-5" v-if="_table.options.isSearch">
      <GetoForm
        ref="getoForm"
        :formItemConfig="_table.formFrame"
        :formInitial="_table.formData"
        :rules="_table.formRules"
        @onFormChange="formChange"
        @remoteMethod="formRemoteMethod"
      />
      <div class="oprationClass">
        <el-button type="primary" @click="formSearch">查询</el-button>
        <el-button @click="formReset">重置</el-button>
      </div>
    </div>
    <div class="">
      <div class="pb-2">
        <slot name="toolbar" />
      </div>
      <el-table
        border
        ref="tableRef"
        highlight-current-row
        :data="_table.datas"
        :height="_table.options.tableHeight"
        :cell-style="_table.options.tableCellStyle"
        :span-method="_table.options.tableSpanMethod"
        @cell-click="tableCellClick"
        @selection-change="tableSelectChange"
        :row-key="_table.options.rowKey || ''"
      >
        <el-table-column
          v-if="_table.options.isSelection"
          type="selection"
          width="50"
          align="center"
          fixed="left"
          :selectable="tableSelectable"
        />
        <el-table-column
          v-if="_table.options.isIndex"
          type="index"
          align="center"
          width="80"
          label="序号"
        />
        <template v-for="(item, index) in _table.cols" :key="index">
          <el-table-column
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :type="item.type"
            :fixed="item.fixed || null"
            v-show="item.display"
          >
            <template v-if="item.children && item.children.length > 0">
              <el-table-column
                align="center"
                v-for="(sItem, sIndex) in item.children"
                :key="sIndex"
                :prop="sItem.prop"
                :label="sItem.label"
                :width="sItem.width"
                :type="sItem.type"
                :fixed="sItem.fixed || null"
                v-show="sItem.display"
              >
                <template v-if="sItem.children && sItem.children.length > 0">
                  <el-table-column
                    align="center"
                    v-for="(ssItem, ssIndex) in sItem.children"
                    :key="ssIndex"
                    :prop="ssItem.prop"
                    :label="ssItem.label"
                    :width="ssItem.width"
                    :type="ssItem.type"
                    :fixed="ssItem.fixed || null"
                    v-show="ssItem.display"
                  >
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
            <template v-if="item.customHtml || item.type === 'expand'" v-slot="scope">
              <slot :name="`${item.prop}name`" :row="scope.row" :item="item" />
              <slot :name="`${item.prop}CustomHtml`" :row="scope.row" :item="item" />
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="_table.options.isOperation"
          align="center"
          :width="'200'"
          fixed="right"
          label="操作"
        >
          <template v-slot="scope">
            <slot name="tableOperation" :row="scope.row" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="_table.options.isPage"
        background
        style="float: right; margin-top: 5px; margin-right: 15px; margin-bottom: 5px"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="_table.options.currentPage"
        :page-size="_table.options.pageSize"
        :page-sizes="_table.options.pageSizesArr"
        :total="_table.options.total"
        @size-change="PageSizeChange"
        @current-change="PageCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import cloneDeep from "lodash/cloneDeep";
import GetoForm from "@/geto-components/GetoForm/index.vue";

const props = defineProps({
  tableSelectable: {
    type: Function,
    default: (row, index) => {
      return true;
    }
  }
});

const tableSelectable = (row, index) => {
  return props.tableSelectable(row, index);
};

const defaultTableConf = {
  formRules: [],
  formData: {},
  formFrame: [],
  datas: [],
  cols: [],
  options: {
    isIndex: false,
    isSelection: true,
    isSearch: true,
    isOperation: false,
    isPage: true,
    currentPage: 1,
    pageSize: 15,
    pageSizesArr: [10, 15, 30, 50],
    total: 0,
    sels: [],
    loading: false,
    tableHeight: null,
    tableCellStyle: null,
    tableSpanMethod: null
  }
};

const tableRef = ref(null);
const getoForm = ref(null);

const _table = ref(defaultTableConf);
// const _table = ref({});

const getTableData = () => {
  let filter = {
    currentPage: _table.value.options.currentPage,
    pageSize: _table.value.options.pageSize
  };
  if (getoForm.value && getoForm.value.getForm()) {
    filter = {
      ...filter,
      ...getoForm.value.getForm()
    };
  }
  console.log(filter);
  emits("getTableData", filter);
  emits("onSearch", filter);
};

const setTableConf = async tableConf => {
  _table.value = {
    ..._table.value,
    cols: tableConf.cols,
    formFrame: tableConf.formFrame,
    formData: tableConf.formData,
    formRules: tableConf.formRules,
    options: {
      ..._table.value.options,
      ...tableConf.options
    }
  };
  // 表单值需要单独更新
  await nextTick();
  if (getoForm.value) {
    getoForm.value.updataForm(_table.value.formData);
  }
};

const formReset = () => {
  getoForm.value.resetForm();
  emits("resetForm", getoForm);
};

const formSearch = async () => {
  const form = await getoForm.value.submitForm();
  if (!form) return;
  getTableData();
};

const formChange = (item, form) => {
  emits("formChange", item, form);
};

const formRemoteMethod = (query, item, form) => {
  emits("formRemoteMethod", query, item, form);
};

const tableSelectChange = selection => {
  const oldSelection = cloneDeep(_table.value.options.sels);
  _table.value.options.sels = selection;
  emits("tableSelectChange", selection, oldSelection);
};

const tableSelectSet = (item, boo = true) => {
  tableRef.value.toggleRowSelection(item, boo);
};

const tableCellClick = (row, column, cell, event) => {
  emits("tableCellClick", row, column, cell, event);
};

const PageSizeChange = val => {
  _table.value.options.pageSize = val;
  getTableData();
};
const PageCurrentChange = val => {
  _table.value.options.currentPage = val;
  getTableData();
};

onMounted(() => {});

// 暴露出子组件方法
defineExpose({
  setTableConf,
  tableSelectSet,
  getoForm,
  _table,
  tableSelectable,
  formSearch
});
// 定义发射给父组件的事件
const emits = defineEmits([
  "getTableData",
  "tableCellClick",
  "tableSelectChange",
  "formChange",
  "formRemoteMethod",
  "resetForm",
]);
</script>
<style lang="scss" scoped>
.table-list {
  overflow: auto;
}

:deep .geto-form {
  padding: 0;
}
</style>
