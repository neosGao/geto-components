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
      <template v-slot:button-row>
        <el-button @click="newIndex">新增</el-button>
        <el-button @click="copy">复制</el-button>
        <el-button @click="delIndex"> 删除 </el-button>
        <el-dropdown
          split-button
          @click="handleUnableOrenable()"
          @command="handleCommand"
        >
          禁用
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="enable">启用</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
  getListPageConf,
  setStatus,
  del
} from "@/geto-components/GetoMspPage/api/messageCenter/messageConfig";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
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
  title: "消息配置列表",
  url: "/api/msp-helper/message/config/list",
  method: "POST",
  export_permission: "",
  info_permission: "OPERATE_TRACKING_POINT_INFO",
  useSelection: true,
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
const newIndex = () => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    const hasForm = useMultiTagsStoreHook().multiTags.some(item => {
      if (item.name === "management_message_message_config_form") {
        if (item.query) {
          return false;
        }
        return true;
      }
      return false;
    });
    if (!hasForm) {
      sessionStorage.removeItem("messageConfigForm");
    }
    useMultiTagsStoreHook().handleTags(
      "splice",
      "/public-system-setting/message-center/message-config-form"
    );
    router.push({
      name: "management_message_message_config_form"
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_message_message_config_form"
  );
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?title=" + "新增考核方案";
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

// 复制
const copy = async () => {
  if (ids.value.length == 0) {
    ElMessage({
      type: "warning",
      message: "请选择需要复制的数据"
    });
    return;
  }
  sessionStorage.removeItem("messageConfigForm");
  useMultiTagsStoreHook().handleTags(
    "splice",
    "/public-system-setting/message-center/message-config-form"
  );
  useMultiTagsStoreHook().handleTags("push", {
    path: "/public-system-setting/message-center/message-config-form",
    meta: {
      title: "消息配置表单"
    },
    query: {
      type: "copy",
      id: ids.value[0]
    },
    name: "management_message_message_config_form"
  });
  router.push({
    name: "management_message_message_config_form",
    query: {
      type: "copy",
      id: ids.value[0]
    }
  });
};


// 搜索
const onSearch = (val = "") => {
  // 接收搜索组件参数
  searchParams.value = val ?? searchParams.value;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接受点击高亮事件
const onHighLightClick = async row => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    sessionStorage.removeItem("messageConfigForm");
    useMultiTagsStoreHook().handleTags(
      "splice",
      "/public-system-setting/message-center/message-config-form"
    );
    useMultiTagsStoreHook().handleTags("push", {
      path: "/public-system-setting/message-center/message-config-form",
      meta: {
        title: "消息配置表单"
      },
      query: {
        type: "view",
        id: row.id
      },
      name: "management_message_message_config_form"
    });
    router.push({
      name: "management_message_message_config_form",
      query: {
        type: "view",
        id: row.id
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(
    item => item.name == "management_message_message_config_form"
  );
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
const handleCommand = command => {
  if (command === "enable") {
    handleUnableOrenable(1);
  }
};

const handleUnableOrenable = async (type = 0) => {
  if (ids.value.length == 0) {
    ElMessage({
      type: "warning",
      message: "请选择需要操作的数据"
    });
    return;
  }
  ElMessageBox.confirm(`确定${type ? "启用" : "禁用"}吗`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "返回",
    type: "warning"
  }).then(async () => {
    const res: any = await setStatus({
      ids: ids.value,
      status: type
    });
    onSearch(null);

    ElMessage({
      type: "success",
      message: `${type ? "启用" : "禁用"}成功`
    });
  });
};
const delIndex = () => {
  if (ids.value.length === 0) {
    ElMessage({
      type: "warning",
      message: "请选择需要操作的数据"
    });
    return;
  }
  ElMessageBox.confirm("确定删除吗", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "返回",
    type: "warning"
  }).then(async () => {
    const res: any = await del({
      ids: ids.value
    });
    onSearch(null);
    ElMessage({
      type: "success",
      message: res.message
    });
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
        onSearch();
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
