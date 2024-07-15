<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_USER_TYPE_SEARCH'"
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
          @click="handleOperate('sync')"
          v-auth="'OPERATE_USER_TYPE_SYNC'"
        >同步
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

    <InfoDrawer ref="infoDrawerRef" @onSearch="onSearch"/>

    <SyncDialog
      ref="syncDialogRef"
      :task_func="syncList"
      class="MspHelper\User\Task\UserTypeListSyncTask"
      @onSearch="onSearch"
    />

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import InfoDrawer from "./components/InfoDrawer.vue";
import SyncDialog from "../components/SyncDialog.vue";
import {emitter} from "@/utils/mitt";
import {useRouter} from "vue-router";
import {message} from "@/utils/message";

import {
  getListPageConf,
  syncList,
  exportList
} from "@/geto-components/GetoMspPage/api/userManage/user-type-list";

defineOptions({
  name: "user_type_list"
});

const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const searchParams = ref({});
const getoTable = ref(null);
const infoDrawerRef = ref(null);
const syncDialogRef = ref(null);
const syncDialogVisible = ref(null);

const ids = ref([]);
const tabName = ref("");

const init_data_config = {
  title: "用户类型",
  method: "POST",
  url: "/api/msp-helper/user/user-type/list",
  info_permission: "OPERATE_USER_TYPE_INFO",
  export_func: exportList,
  export_permission: "OPERATE_USER_TYPE_EXPORT",
  task_class: "UserTypeListExcelExportTask",
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
const onHighLightClick = async row => {
  infoDrawerRef.value.show(row.id);
};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};


// 操作处理
const handleOperate = type => {
  switch (type) {
    case "sync":
      handleSync();
      break;
  }
}

const handleSync = async () => {
  syncDialogRef.value.show();
}

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
</style>
