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
        <el-button
          class="ml-1"
          @click="handleSync"
          v-auth="'OPERATE_SYSTEM_ANNOUNCEMENT_SYNC'"
        >
          同步
        </el-button>
      </template>
    </GetoTable>
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
    />
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList,
  syncData
} from "@/geto-components/GetoMspPage/api/announcement-manage";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { usePage } from "@/geto-components/GetoUtils/page";

defineOptions({
  name: "system_announcement"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "公告列表",
  url: "/api/msp-helper/announcement/system-announcement/list",
  method: "POST",
  task_class: "RoleListExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_SYSTEM_ANNOUNCEMENT_EXPORT",
  info_permission: "OPERATE_SYSTEM_ANNOUNCEMENT_INFO",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
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
const { addPageByQuery } = usePage();
const onHighLightClick = row => {
  addPageByQuery("announcement_info", {
    id: row.id
  });
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
const sync_task_config = {
  task_class: "MspHelper\\Announcement\\Task\\AnnouncementSyncTask"
};

// 同步
const getoSyncDataDailog = ref(null);
const handleSync = () => {
  ElMessageBox.confirm("确认同步公告？", "请确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      syncData({
        async: true
      }).then((res: any) => {
        message(res.data.msg, {
          type: "success"
        });
        getoSyncDataDailog.value.show();
      });
    })
    .catch(() => {
      message("已取消同步", {
        type: "info"
      });
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
