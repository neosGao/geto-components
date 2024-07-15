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
        <el-button @click="markRead">标记已读</el-button>
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

    <el-dialog title="消息中心-详情" v-model="detailData.show" width="40%">
      <GetoDetailPage
        :formItemConfig="messageListDetail"
        :formInitial="detailData.formData"
        class="!flex-none"
      >
        <template #formItem="{ item, form }"
          ><div v-html="form[item.prop]"
        /></template>
      </GetoDetailPage>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoDetailPage from "@/geto-components/GetoDetailPage/index.vue";
import { messageListDetail } from "./components/config.js";
import {
  getListPageConf,
  info,
  read
} from "@/geto-components/GetoMspPage/api/messageCenter/messageList";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
defineOptions({
  name: "management_message_list"
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
  title: "消息列表",
  url: "/api/msp-helper/message/user-message/list",
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
const detailData = ref({
  show: false,
  formData: {}
});
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
// 搜索
const onSearch = val => {
  console.log(val);
  // 接收搜索组件参数
  searchParams.value = val ?? searchParams.value;
  if (!getoTable.value) return;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接受点击高亮事件
const markRead = async () => {
  if (!ids.value.length) {
    ElMessage({
      type: "warning",
      message: "请选择一条需要操作的数据"
    });
    return;
  }
  const res: res = await read({ ids: ids.value });
  if (res.code == "0") {
    ElMessage({
      type: "success",
      message: res.message
    });
    onSearch(null);
  }
};
// 接受点击高亮事件
const onHighLightClick = async row => {
  const res: res = await info({ id: row.id });
  if (res.code == "0") {
    if (row.status == 0) {
      emitter.emit("changePushStatus");
    }
    detailData.value.formData = res.data;
    detailData.value.show = true;
    onSearch(null)
  }
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
  window.addEventListener("message", event => {
    if (event.data && event.data.flag === "refreshHr" && event.data.data) {
      // 在这里执行你的逻辑，包括调用 onSearch 函数
      if (event.data.data.pathName === "assessment_scheme") {
        onSearch(null);
      }
    }
  });
};
const queryId = ref();
// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  // 接收事件
  emitter.on("showPageListSave", returnName => {
    tabName.value = returnName;
    // 获取列表页面新配置
    getListPageConfAPI();
    setTimeout(() => {
      view_conf.value.forEach(item => {
        if (item.name === tabName.value) {
          onSearch({ query: item.conf.search.value });
        }
      });
    }, 500);
  });
  messageListener();

  queryId.value = router.currentRoute.value.query.id as string;
  if (queryId.value) {
    onHighLightClick({ id: queryId.value, status: 0 });
  }
});
</script>

<style lang="scss" scoped>
.el-date-picker {
  width: 125%;
}
</style>
