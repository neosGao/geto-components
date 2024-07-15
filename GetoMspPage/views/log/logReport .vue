<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_OPERATION_REPORT_SEARCH'"
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
      </template>
    </GetoTable>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import {getListPageConf} from "@/geto-components/GetoMspPage/api/logReportApi";
import {emitter} from "@/utils/mitt"; //使用mitt进行事务管理
import {useRouter} from "vue-router";
import {message} from "@/utils/message";
import {ElMessageBox} from "element-plus";

defineOptions({
  name: "draw_plan"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "日志报表",
  url: "/api/msp-helper/log/operation-report/list",
  method: "POST",
  task_class: "OperationLogReportTask",
  export_permission: "OPERATE_OPERATION_REPORT_EXPORT",
  useExport: true,
  useSelection: true
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
const onHighLightClick = async row => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: "management_control_strategy_form",
      query: {
        type: "edit",
        id: row.id
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_control_strategy_form"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?id=" + row.id + "&type=edit";
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({flag: "tab", data: params}, "*"); //解决跨域
  window.parent.postMessage({flag: "loading", data: {loading: false}}, "*");
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
// 新增方法
const env = import.meta.env;
const newIndex = () => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: "management_control_strategy_form"
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_control_strategy_form"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path;
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({flag: "tab", data: params}, "*"); //解决跨域
  window.parent.postMessage({flag: "loading", data: {loading: false}}, "*");
};
// 编辑方法
const editIndex = () => {
  if (ids.value.length !== 1) {
    message("请选中一条数据进行编辑！", {type: "warning"});
    return;
  }
  onHighLightClick({id: ids.value[0]});
};
const copyIndex = () => {
  if (ids.value.length !== 1) {
    message("请选中一条数据进行复制！", {type: "warning"});
    return;
  }
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: "management_control_strategy_form",
      query: {
        type: "copy",
        id: ids.value[0]
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_control_strategy_form"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?id=" + ids.value[0] + "&type=copy";
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({flag: "tab", data: params}, "*"); //解决跨域
  window.parent.postMessage({flag: "loading", data: {loading: false}}, "*");
};

// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", returnName => {
    console.log("😅 ~ file: index.vue:90 ~ onMounted ~ config:", tabName);
    tabName.value = returnName;
    // 获取列表页面新配置
    getListPageConfAPI();
  });
});
</script>
