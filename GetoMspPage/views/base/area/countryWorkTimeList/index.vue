<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-21 11:31:20
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-12-13 11:27:07
 * @FilePath: \scm-web\src\geto-components\GetoMspPage\views\base\area\countryWorkTimeList\index.vue
 * @Description: 国家工作时间-列表
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
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <template v-slot:button-row>
        <el-button @click="handleSync">同步</el-button>
      </template>
    </GetoTable>
    <DetailDialog
      ref="detailDialog"
      @afterSubmit="handleAfterSubmit"
      :show="detailShow"
    />
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
import DetailDialog from "./components/detailDialog.vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList,
  sync
} from "@/geto-components/GetoMspPage/api/base/countryWorkTimeList";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "national_working_hours"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const detailShow = ref(false);
const init_data_config = {
  title: "国家工作时间",
  url: "/api/msp-helper/publicbasicdata/country-work-time/index",
  method: "POST",
  task_class: "CountryWorkTimeExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_COUNTRY_WORK_TIME_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
const detailDialog = ref(null);
const storeRoleDrawer = ref(null);
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
const handleAfterSubmit = () => {
  getoTable.value.onClickSearch(searchParams);
};
const getoSyncDataDailog = ref(null);
const sync_task_config = {
  task_class: "PublicBasicDataSyncTask",
  sync_func: sync
};
const handleSync = () => {
  getoSyncDataDailog.value.show();
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接受点击高亮事件
const onHighLightClick = row => {
  storeRoleDrawer.value.show(row.id);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
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

<style scoped>
.menu-1 {
  height: calc(100vh - 85px);
  padding: 10px;
}

.table-opt-btn {
  margin-right: 10px;
}
</style>
