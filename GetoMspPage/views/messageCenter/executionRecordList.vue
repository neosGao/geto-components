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
import { getListPageConf } from "@/geto-components/GetoMspPage/api/messageCenter/executionRecord";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
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
const init_data_config = {
  title: "执行记录",
  url: "/api/msp-helper/message/trigger-log/list",
  method: "POST",
  export_permission: "",
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
  const res: res = await getListPageConf();
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
// 新增方法
const env = import.meta.env;
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val ?? searchParams.value;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};

// 接受点击高亮事件
const onHighLightClick = async row => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    useMultiTagsStoreHook().handleTags(
      "splice",
      "/public-system-setting/message-center/send-record-list"
    );
    useMultiTagsStoreHook().handleTags("push", {
      path: "/public-system-setting/message-center/send-record-list",
      meta: {
        title: "发送记录"
      },
      query: {
        id: row.id
      },
      name: "management_send_record_list"
    });
    router.push({
      name: "management_send_record_list",
      query: {
        id: row.id
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == "management_send_record_list");
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?id=" + row.id + "&type=view";
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => {
    return item.id;
  });
};
// 消息监听
const messageListener = () => {
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == "assessment_scheme");
  console.log(
    "😅 ~ file: assessmentPlanList.vue:216 ~ messageListener ~ route:",
    route
  );
  window.addEventListener("message", event => {
    console.log(
      "😅 ~ file: assessmentPlanList.vue:221 ~ messageListener ~ event:",
      event
    );
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
