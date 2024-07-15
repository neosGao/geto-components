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
    >
      <template v-slot:button-row>
        <el-button
          class="ml-1"
          plain
          @click="showQrCodeDrawer()"
          v-auth="'OPERATE_USER_INFO'">
          二维码
        </el-button>

        <el-button
          class="ml-1"
          plain
          @click="showSyncDialog()"
          v-auth="'OPERATE_USER_SYNC'"
          >同步数据
        </el-button>

        <el-button
          class="ml-1"
          @click="handleBindUser"
          v-auth="'OPERATE_USER_BIND_ROLE'"
          >批量分配角色
        </el-button>

        <el-button
          class="ml-1"
          plain
          @click="handleViewUserPermission"
          v-auth="'OPERATE_USER_VIEW_USER_PERMISSION'"
          >查看用户权限
        </el-button>

        <el-button
          class="ml-1"
          plain
          @click="showPositionDialog()"
          v-auth="'OPERATE_USER_GET_POSITION'"
          >查看任职情况
        </el-button>
      </template>

      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status }}
        </el-tag>
      </template>
    </GetoTable>

    <QrCodeDrawer ref="qrCodeDrawerRef" @onSearch="onSearch" :selectedUser="selectedUser"/>

    <InfoDrawer ref="infoDrawerRef" @onSearch="onSearch" />

    <BindRole
      ref="bindRole"
      title="批量绑定角色"
      :user_ids="ids"
      @onSearch="onSearch"
    />

    <BindRole
      ref="bindRole"
      title="批量绑定角色"
      :user_ids="ids"
      @onSearch="onSearch"
    />

    <SyncDialog
      ref="syncDialogRef"
      :task_func="syncList"
      class="MspHelper\User\Task\UserListSyncTask"
      @onSearch="onSearch"
    />

    <PositionDialog ref="positionDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import QrCodeDrawer from "./components/QrCodeDrawer.vue";
import InfoDrawer from "./components/InfoDrawer.vue";
import SyncDialog from "../components/SyncDialog.vue";
import BindRole from "./components/BindRole.vue";
import PositionDialog from "./components/PositionDialog.vue";

import { emitter } from "@/utils/mitt";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";

import {
  getListPageConf,
  syncList,
  exportList
} from "@/geto-components/GetoMspPage/api/userManage/user-list";

defineOptions({
  name: "user_list"
});

const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const searchParams = ref({});
const getoTable = ref(null);
const qrCodeDrawerRef = ref(null);
const infoDrawerRef = ref(null);
const syncDialogRef = ref(null);
const bindRole = ref(null);
const positionDialogRef = ref(null);

const ids = ref([]);
const tabName = ref("");
const selectedUser = ref([]);

const init_data_config = {
  title: "用户列表",
  method: "POST",
  url: "/api/msp-helper/user/list",
  info_permission: "OPERATE_USER_INFO",
  export_func: exportList,
  export_permission: "OPERATE_USER_EXPORT",
  task_class: "UserListExcelExportTask",
  useExport: true,
  useSelection: true,
  useIndex: true
};

const showQrCodeDrawer = () => {
  qrCodeDrawerRef.value.show();
}

const showSyncDialog = () => {
  syncDialogRef.value.show();
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
const onHighLightClick = async row => {
  infoDrawerRef.value.show(row.id);
};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  selectedUser.value = selection;
};

const handleBindUser = () => {
  if (ids.value.length == 0) {
    message("请选择用户", { type: "warning" });
    return;
  }
  bindRole.value.show(ids.value);
};

const handleViewUserPermission = () => {
  router.push({
    name: "user_permission_statement"
  });
};

const showPositionDialog = () => {
  if (ids.value.length == 0) {
    message("请选择用户", { type: "warning" });
    return;
  }
  positionDialogRef.value.show(ids.value);
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
