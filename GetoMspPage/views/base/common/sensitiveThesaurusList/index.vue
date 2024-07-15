<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status_name'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status_name }}</el-tag
        >
      </template>
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
import { getListPageConf, exportList, sync } from "./api";

defineOptions({
  name: "sensitive_thesaurus"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "敏感词库-一级列表",
  url: "/api/msp-helper/publicbasicdata/sensitive-thesaurus/index",
  method: "POST",
  task_class: "SensitiveThesaurusExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_SENSITIVE_THESAURUS_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref();
const ids = ref([]);
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value[0];
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
  console.log(row);
};
const list_data = ref([]);
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  list_data.value = selection;
};
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
