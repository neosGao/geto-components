<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_PERMISSION_ROLE_LIST_SEARCH"
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
        <StoreRoleDrawer
          class="ml-1"
          ref="storeRoleDrawer"
          title="新增角色"
          @onSearch="onSearch"
        />
        <el-button
          class="ml-1"
          @click="openImport"
          v-auth="'OPERATE_PERMISSION_ROLE_LIST_IMPORT'"
        >
          导入
        </el-button>
        <UnableOrEnableRole
          class="ml-1"
          ref="unableOrEnableRole"
          @onSearch="onSearch"
          :ids="ids"
          v-auth="'OPERATE_PERMISSION_ROLE_LIST_UNABLE_ENABLE'"
        />
        <el-button
          class="ml-1"
          @click="handleViewRolePermission"
          v-auth="'OPERATE_PERMISSION_ROLE_LIST_SHOW_ROLE_PERMISSION'"
        >
          查看角色权限
        </el-button>
        <DelBtn
          class="ml-1"
          :ids="ids"
          @onSearch="onSearch"
          v-auth="'OPERATE_PERMISSION_ROLE_LIST_DELETE'"
        />
      </template>
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status }}</el-tag
        >
        <span v-if="item.value == 'is_system_set'">
          {{ row.is_system_set }}</span
        >
        <span v-if="item.value == 'create_time'">
          <el-icon><timer /></el-icon>
          {{ row.create_time }}</span
        >
      </template>
      <!-- <template v-slot:operate_column>
        <el-table-column width="100" align="center" fixed="right" label="操作">
          <template v-slot="{ row }">
            <el-button
              text
              small
              type="primary"
              @click="handleBindPermission(row.id)"
              v-auth="'OPERATE_PERMISSION_ROLE_LIST_BIND_PERMISSION'"
              >绑定权限</el-button
            >
          </template>
        </el-table-column>
      </template> -->
    </GetoTable>
    <GetoImportDialog
      ref="GetoImportDialogList"
      template="角色列表导入模板.xlsx"
      class="MspHelper\Permission\ExcelImport\RoleListExcelImportTask"
      :import_func="importRole"
      @onSearch="onSearch"
    />
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoImportDialog from "@/geto-components/GetoImportDialog/index.vue";
import StoreRoleDrawer from "./components/StoreRoleDrawer.vue";
import UnableOrEnableRole from "./components/UnableOrEnableRole.vue";
import DelBtn from "./components/DelBtn.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  importRole,
  exportList
} from "@/geto-components/GetoMspPage/api/role-list";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { Timer } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "role_list"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "角色列表",
  url: "/api/msp-helper/permission/role-manage/list",
  method: "POST",
  task_class: "RoleListExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_PERMISSION_ROLE_LIST_EXPORT",
  info_permission: "OPERATE_PERMISSION_ROLE_LIST_INFO",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const storeRoleDrawer = ref(null);
const ids = ref([]);
const GetoImportDialogList = ref(null);
const router = useRouter();
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
// 接受点击高亮事件
const onHighLightClick = row => {
  storeRoleDrawer.value.show(row.id);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
const openImport = () => {
  GetoImportDialogList.value.show();
};
const handleViewRolePermission = () => {
  router.push({
    name: "role_permission_statement"
  });
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
