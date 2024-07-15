<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-6 15:28:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-11-15 15:28:28
 * @FilePath: src\geto-components\GetoMspPage\views\base\area\divisionList\index.vue
 * @Description: 行政区域管理-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" :defaultTab="tabName" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @selectionChange="selectionChange"
    >
      <template v-slot:button-row>
        <el-button @click="handleSync">同步</el-button>
      </template>
      <template v-slot:column="{ row, item }">
        <span v-if="item.value == 'code'">
          <el-link :underline="false" type="primary" @click="detail(row)">
            {{ row.code }}
          </el-link>
        </span>
        <span v-if="item.value == 'status_name'">
          <el-tag
            v-if="item.value == 'status_name'"
            :type="row.status_name == '启用' ? 'success' : 'warning'"
            >{{ row.status_name }}</el-tag
          >
        </span>
      </template>
    </GetoTable>
    <divisionDetailDialog
      ref="divisionDetailDialogRef"
      @afterSubmit="handleAfterSubmit"
    />
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="onSearch"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import divisionDetailDialog from "./components/divisionDetailDialog.vue";

import {
  getListPageConf,
  exportList,
  sync
} from "@/geto-components/GetoMspPage/api/base/divisionList";

defineOptions({
  name: "administrative_division"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "行政区域管理列表",
  url: "api/msp-helper/publicbasicdata/division/index",
  method: "POST",
  task_class: "DivisionExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_REGION_MANAGEMENT_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
const divisionDetailDialogRef = ref(null);
const tabName = ref("默认");

// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value.filter(
    item => item.name === tabName.value
  )[0];
  table_conf.value = default_view.conf.list_columns;
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 同步
const getoSyncDataDailog = ref(null);
const sync_task_config = {
  task_class: "PublicBasicDataSyncTask",
  sync_func: sync
};
const handleSync = () => {
  getoSyncDataDailog.value.show();
};
const selectionData = ref([]);
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  selectionData.value = selection;
};
// 详情
const detail = (row: any) => {
  divisionDetailDialogRef.value.show(row, "view");
};
// 触发列表刷新
const handleAfterSubmit = () => {
  getoTable.value.onClickSearch(searchParams);
};
// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", returnName => {
    tabName.value = returnName;
    getListPageConfAPI();
  });
});
</script>
<style lang="scss" scoped>
.menu-1 {
  height: calc(100vh - 85px);
  padding: 10px;
}

.table-opt-btn {
  margin-right: 10px;
}
</style>
