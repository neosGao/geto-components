<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" :defaultTab="tabName" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <!-- <template v-slot:button-row>
        <el-button @click="manualSend">手动发送</el-button>
      </template> -->
      <template v-slot:operate_column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="manualSending(row)"
              >手动发送</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-button
          @click="newIndex"
          v-auth="'OPERATE_MANAGEMENT_CONTROL_STRATEGY_STORE'"
          >标记已读</el-button
        > -->
      </template>
      <template v-slot:column="{ row, item }">
        <el-button type="text" @click="onHighLightClick(row)">{{
          row[item.value]
        }}</el-button>
      </template>
    </GetoTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import {
  getSendListPageConf,
  manualSend
} from "@/geto-components/GetoMspPage/api/messageCenter/executionRecord";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
defineOptions({
  name: "assessment_plan_list"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
interface res {
  code?: string;
  data?: any;
  message?: string;
}
const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const id = ref(router.currentRoute.value.query.id as string);
const init_data_config = {
  title: "发送记录",
  url: "/api/msp-helper/message/send-log/list",
  method: "POST",
  export_permission: "",
  searchParams: { trigger_log_id: id.value },
  data: { trigger_log_id: id.value },
  info_permission: "OPERATE_TRACKING_POINT_INFO",
  useSelection: false,
  useExport: false
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
const tabName = ref("");
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: res = await getSendListPageConf();
  if (res.code != "0") return;
  view_conf.value = res.data["page_conf"]["view_conf"];
  let default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;
  view_conf.value.forEach(item => {
    if (item.name === tabName.value) {
      default_view = item;
      table_conf.value = item.conf.list_columns;
    }
  });
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val ?? searchParams.value;
  searchParams.value.trigger_log_id = id.value
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接受点击高亮事件
const manualSending = async row => {
  if (row.status != 3) {
    ElMessage({
      type: "warning",
      message: "此状态不能手动发送"
    });
    return;
  }
  const res: res = await manualSend({ id: row.id });
  if (res.code == "0") {
    ElMessage({
      type: "success",
      message: res.message
    });
    // onSearch(null);
  }
};
// 接受点击高亮事件
const onHighLightClick = async row => {
  // const res: res = await info({ id: row.id });
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => {
    return item.id;
  });
};
// 消息监听
const messageListener = () => {
  // const routes = router.getRoutes();
  // const route = routes.find(item => item.name == "assessment_scheme");
  window.addEventListener("message", event => {
    if (event.data && event.data.flag === "refreshHr" && event.data.data) {
      // 在这里执行你的逻辑，包括调用 onSearch 函数
      if (event.data.data.pathName === "assessment_scheme") {
        onSearch(null);
      }
    }
  });
};
// 挂载
onMounted(() => {
  console.log(2222222);
  getListPageConfAPI();
  // 接收事件
  // 接收事件
  emitter.on("showPageListSave", returnName => {
    console.log("😅 ~ file: index.vue:90 ~ onMounted ~ config:", tabName);
    tabName.value = returnName;
    // 获取列表页面新配置
    getListPageConfAPI();
  });
  messageListener();
});
</script>
