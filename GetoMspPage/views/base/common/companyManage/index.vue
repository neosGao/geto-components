<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_COMPANY_MANAGE_SEARCH"
      @onSearch="onSearch"
      :defaultTab="tabName"
    />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <template v-slot:button-row>
        <!-- 按钮位置插槽 -->
        <el-button v-auth="'OPERATE_COMPANY_MANAGE_SYNC'" @click="handleSync">
          同步
        </el-button>
      </template>
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status }}</el-tag
        >
      </template>
    </GetoTable>
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="onSearch"
    />
    <InfoDrawer ref="infoDrawer" />
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ref, onMounted, defineOptions } from "vue";
import { getListPageConf, exportList, sync } from "./api";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import InfoDrawer from "./components/InfoDrawer.vue";

defineOptions({
  name: "company_manage"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "公司列表",
  url: "/api/msp-helper/publicbasicdata/company-manage/index",
  method: "POST",
  task_class: "MspHelper\\PublicBasicData\\Task\\CompanyManageExcelExport",
  export_func: exportList,
  export_permission: "OPERATE_COMPANY_MANAGE_EXPORT",
  info_permission: "OPERATE_COMPANY_MANAGE_INFO",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const infoDrawer = ref(null);
const ids = ref([]);
const tabName = ref("默认");
const id = ref(0);
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
// 接受点击高亮事件
const onHighLightClick = row => {
  id.value = row.id;
  infoDrawer.value.show(row.id);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
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
