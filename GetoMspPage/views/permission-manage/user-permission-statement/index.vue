<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_USER_PERMISSION_STATEMENT_SEARCH"
      @onSearch="onSearch"
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
      </template>
    </GetoTable>
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList
} from "@/geto-components/GetoMspPage/api/user-permission-statement";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "user_permission_statement"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "用户权限报表",
  url: "/api/msp-helper/permission/user-permission-statement/list",
  method: "POST",
  task_class: "UserPermissionExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_USER_PERMISSION_STATEMENT_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const storeRoleDrawer = ref(null);
const ids = ref([]);
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
