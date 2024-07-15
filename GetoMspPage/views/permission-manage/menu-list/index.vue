<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_MENU_LIST_SEARCH"
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
        <SyncBtn
          v-auth="'OPERATE_PERMISSION_PAGE_MANAGE_SYNC'"
          @onSearch="onSearch"
        />
      </template>
    </GetoTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import {
  getListPageConf,
  exportList
} from "@/geto-components/GetoMspPage/api/menu";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import SyncBtn from "./components/SyncBtn.vue";
defineOptions({
  name: "menu_list"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "菜单列表",
  url: "/api/msp-helper/menu/list",
  method: "POST",
  export_func: exportList,
  task_class: "MenuListExcelExportTask",
  export_permission: "OPERATE_MENU_LIST_EXPORT",
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
  // 获取列表页面新配置
  emitter.on("showPageListSave", () => {
    // 获取列表页面新配置
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
