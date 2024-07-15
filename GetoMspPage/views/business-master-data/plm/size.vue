<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_MD_MOULD_LIST_SEARCH"
      @onSearch="onSearch"
      :defaultTab="tabName"
    />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @selectionChange="selectionChange"
    >
      <template v-slot:button-row>
        <!-- 按钮位置插槽 -->
        <el-button
          class="ml-1"
          @click="handleSync"
          v-auth="'OPERATE_MD_MOULD_LIST_SYNC'"
        >
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
      @onCancelClick="onSearch(searchParams)"
    />
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { ref, onMounted } from "vue";
import { getListPageConf, exportList, sync } from "./api";
import { useRouter } from "vue-router";

defineOptions({
  name: "md_mould_list"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const router = useRouter();
const path = router.currentRoute.value.path.split("/").pop();
const tabName = ref("未删除");
const searchParams = ref({
  path: path,
  view_name: tabName.value
});
const init_data_config = {
  title: "尺寸维护列表",
  url: "/api/msp-helper/businessmasterdata/plm/" + path + "/list",
  method: "POST",
  task_class: "MdPlmExcelExport",
  export_func: exportList,
  export_permission: "OPERATE_MD_MOULD_LIST_EXPORT",
  info_permission: "",
  useSelection: true,
  useIndex: true,
  searchParams: searchParams.value
};
const getoTable: any = ref(null);
const ids = ref([]);
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value.filter(
    (item: any) => item.name === tabName.value
  )[0];
  table_conf.value = default_view.conf.list_columns;
};

// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  searchParams.value.path = path;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
// 同步
const getoSyncDataDailog: any = ref(null);
const sync_task_config: any = ref({
  task_class: "MdSyncTask",
  sync_func: sync,
  path: path
});
const handleSync = async () => {
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
