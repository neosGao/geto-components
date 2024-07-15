<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-14 15:28:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-11-15 15:28:28
 * @FilePath: src\geto-components\GetoMspPage\views\base\finance\exchangeRateList\index.vue
 * @Description: 汇率管理-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      :tableFunction="tableFunction"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <template v-slot:button-row>
        <el-button @click="handleSync">同步</el-button>
      </template>
    </GetoTable>
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList,
  sync
} from "@/geto-components/GetoMspPage/api/base/exchangeRateList";
import { spanRules } from "@/geto-components/GetoUtils/merge";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "exchange_rate_list"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "汇率管理",
  url: "/api/msp-helper/publicbasicdata/exchange-rate/index",
  method: "POST",
  task_class: "ExchangeRateExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_RATE_MANAGEMENT_EXPORT",
  useSelection: false,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const storeRoleDrawer = ref(null);
const ids = ref([]);
const tableFunction = ref({
  spanMethod: spanMethodRow
});
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;
};

// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
  console.log(getoTable.value);
};
// 接受点击高亮事件
const onHighLightClick = row => {
  storeRoleDrawer.value.show(row.id);
};
const selectionData = ref([]);
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  selectionData.value = selection;
};
// 表格函数 合并行
function spanMethodRow({ row, column, rowIndex, columnIndex }) {
  const _row = row;
  const _columnIndex = columnIndex;
  const list = getoTable.value.tableData;
  const spanArr = spanRules(["date"], list);
  // 指定列合并
  if (column.property === "date") {
    if (spanArr[rowIndex]) {
      return {
        rowspan: spanArr[rowIndex], // 单元格可横跨的行数
        colspan: 1 // 单元格可横跨的列数
      };
    } else {
      return {
        rowspan: 0, // 等于0表示不合并
        colspan: 0
      };
    }
  }
}
const getoSyncDataDailog = ref(null);
const sync_task_config = {
  task_class: "PublicBasicDataSyncTask",
  sync_func: sync
};
const handleSync = () => {
  getoSyncDataDailog.value.show();
};
// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", () => {
    getListPageConfAPI();
  });
});
</script>

<style scoped>
.menu-1 {
  height: calc(100vh - 85px);
  padding: 10px;
}

.table-opt-btn {
  margin-right: 10px;
}
</style>
