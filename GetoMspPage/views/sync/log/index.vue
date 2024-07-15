<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_USER_SEARCH'"
    />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { emitter } from "@/utils/mitt";
import {
  getListPageConf,
  exportList
} from "@/geto-components/GetoMspPage/api/sync/log";

defineOptions({
  name: "sync_log"
});

const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const searchParams = ref({});
const getoTable = ref(null);

const ids = ref([]);
const tabName = ref("");
const selectedUser = ref([]);

const init_data_config = {
  title: "任务日志",
  method: "POST",
  url: "/api/msp-helper/sync/log/list",
  info_permission: "OPERATE_USER_INFO",
  export_func: exportList,
  export_permission: "OPERATE_USER_EXPORT",
  task_class: "UserListExcelExportTask",
  useExport: true,
  useSelection: true,
  useIndex: true
};

// 获取列表页面配置
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;
};

// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};

// 接受点击高亮事件
const onHighLightClick = async row => {};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  selectedUser.value = selection;
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
