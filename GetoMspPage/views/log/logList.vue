<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_OPERATION_SEARCH'"
    />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
      @handleExpandChange="handleExpandChange"
    >
      <template v-slot:button-row />
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status }}</el-tag
        >

        <el-popover placement="top-start" :width="200" trigger="hover">
          <template #reference>
            <span class="circle-r" v-if="row.warning_level_value != '0'"
              >!
            </span>
          </template>
          <div>
            <span class="early-warning">预警级别：{{ row.warning_level }}</span>
          </div>
        </el-popover>

        <el-popover placement="top-start" :width="200" trigger="hover">
          <template #reference>
            <span class="circle-b" v-if="row.agent_user_id != '0'">代 </span>
          </template>
          <span class="agent">
            <div>代理人：{{ row.agent_user_name }}</div>
            <div>代理账号：{{ row.agent_user_number }}</div>
          </span>
        </el-popover>
      </template>
      <template v-slot:rowExpand="{ scope }">
        <div class="expand-box" v-if="table_list_detail[scope.row.id]">
          <el-form
            label-position="left"
            inline
            label-width="80px"
            class="demo-table-expand"
          >
            <el-form-item label="登录信息:">
              <span>{{
                table_list_detail[scope.row.id].operate_user_name
              }}</span>
            </el-form-item>
            <el-form-item label="请求地址:">
              <span>{{ table_list_detail[scope.row.id].request_path }}</span>
            </el-form-item>
            <el-form-item label="请求方法:">
              <span>{{ table_list_detail[scope.row.id].request_method }}</span>
            </el-form-item>
            <el-form-item label="请求参数:">
              <span>{{
                table_list_detail[scope.row.id].request_param.substr(0, 100)
              }}</span
              >...
              <el-button
                text
                type="primary"
                @click="
                  viewMore(
                    table_list_detail[scope.row.id].request_param,
                    '请求参数'
                  )
                "
                >更多</el-button
              >
            </el-form-item>
            <el-form-item label="返回参数:">
              <span>{{
                table_list_detail[scope.row.id].response_param.substr(0, 100)
              }}</span
              >...
              <el-button
                text
                type="primary"
                @click="
                  viewMore(
                    table_list_detail[scope.row.id].response_param,
                    '返回参数'
                  )
                "
                >更多</el-button
              >
            </el-form-item>
            <el-form-item label="操作状态:">
              <span>{{ table_list_detail[scope.row.id].status }}</span>
            </el-form-item>
            <el-form-item label="消耗时间:">
              <span>{{ table_list_detail[scope.row.id].use_time }}</span>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </GetoTable>

    <el-dialog
      v-model="dialog_data.show"
      :title="dialog_data.title"
      width="40%"
    >
      <el-input
        v-model="dialog_data.data"
        :rows="25"
        readonly
        type="textarea"
        placeholder="Please input"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "./components/GetoTable.vue";
import {
  getListPageConf,
  getOperationInfo,
} from "@/geto-components/GetoMspPage/api/logApi";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
defineOptions({
  name: "draw_plan"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const table_list_detail = ref({});
const dialog_data = ref({
  show: false,
  title: "",
  data: ""
});
const init_data_config = {
  title: "操作日志",
  url: "/api/msp-helper/log/operation/list",
  method: "POST",
  export_permission: "OPERATE_OPERATION_EXPORT",
  info_permission: "OPERATE_OPERATION_INFO",
  useExport: true,
  useExpand: true,
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
  // const res: any = confs;
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
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
const handleExpandChange = async (row, expanded) => {
  console.log(row, expanded);
  if (expanded.findIndex(item => item.id == row.id) > -1) {
    if (!Object.keys(table_list_detail.value).includes(row.id)) {
      const res4: any = await getOperationInfo({ id: row.id });
      table_list_detail.value[row.id] = res4.data;
    }
  }
};
const viewMore = (param, title) => {
  console.log(param);
  dialog_data.value.show = true;
  dialog_data.value.title = title;
  dialog_data.value.data = JSON.stringify(JSON.parse(param), null, 4);
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
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};
// 编辑方法
const editIndex = () => {
  if (ids.value.length !== 1) {
    message("请选中一条数据进行编辑！", { type: "warning" });
    return;
  }
  onHighLightClick({ id: ids.value[0] });
};
const copyIndex = () => {
  if (ids.value.length !== 1) {
    message("请选中一条数据进行复制！", { type: "warning" });
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
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
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

<style lang="scss" scoped>
.early-warning {
  color: red;
}
.circle-r {
  color: red;
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: inline-block;
  border: 1px solid red;
  border-radius: 50%;
  margin-left: 5px;
}
.agent {
  color: #3399ff;
}
.circle-b {
  color: #3399ff;
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: inline-block;
  border: 1px solid #3399ff;
  border-radius: 50%;
  margin-left: 5px;
}
.expand-box {
  padding-left: 100px;
  background-color: #f2f2f2;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
