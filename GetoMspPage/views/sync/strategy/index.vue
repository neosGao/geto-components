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
        <el-button @click="handleInc" plain> 立即执行 </el-button>
        <el-button @click="handleAdd" plain> 新增 </el-button>
        <el-dropdown
          class="ml-2"
          split-button
          @click="handleDisbleOrEnable()"
          @command="handleCommand"
        >
          禁用
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="enable">启用</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="ml-2" type="danger" @click="handleDel" plain>
          删除
        </el-button>
      </template>
    </GetoTable>
    <StoreDrawer ref="storeDrawer" title="新增" @onSearch="onSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { emitter } from "@/utils/mitt";
import { message } from "@/utils/message";
import StoreDrawer from "./components/StoreDrawer.vue";
import { ElMessageBox } from "element-plus";
import {
  getListPageConf,
  exportList,
  enable,
  disable,
  del,
  inc
} from "@/geto-components/GetoMspPage/api/sync/strategy";

defineOptions({
  name: "strategy"
});

const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const searchParams = ref({});
const getoTable = ref(null);

const ids = ref([]);
const tabName = ref("");
const selectedUser = ref([]);

const init_data_config = {
  title: "策略任务",
  method: "POST",
  url: "/api/msp-helper/sync/strategy/list",
  info_permission: "OPERATE_USER_INFO",
  export_func: exportList,
  export_permission: "OPERATE_USER_EXPORT",
  task_class: "UserListExcelExportTask",
  useExport: true,
  useSelection: true,
  useIndex: true
};

const handleDel = () => {
  if (ids.value.length <= 0) {
    message("请选择需要删除数据", {
      type: "warning"
    });
    return;
  }
  ElMessageBox.confirm("确定删除吗", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "返回",
    type: "error"
  }).then(async () => {
    const res: any = await del({
      ids: ids.value
    });
    if (res.code === "0") {
      message(res.message, {
        type: "success"
      });
      onSearch({});
    }
  });
};

const handleInc = async () => {
  if (ids.value.length <= 0) {
    ElMessageBox.confirm("是否全部执行", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "返回",
      type: "info"
    }).then(async () => {
      const res: any = await inc({});
      if (res.code === "0") {
        message(res.message, {
          type: "success"
        });
        onSearch({});
      }
    });
  } else {
    const res: any = await inc({
      ids: ids.value
    });
    if (res.code === "0") {
      message(res.message, {
        type: "success"
      });
      onSearch({});
    }
  }
};

const handleCommand = command => {
  if (command === "enable") {
    handleDisbleOrEnable(1);
  }
};

const handleDisbleOrEnable = async (type = 2) => {
  if (ids.value.length <= 0) {
    message("请选择需要操作一条的数据", { type: "warning" });
    return;
  }
  let operateFunc = enable;
  if (type == 2) {
    operateFunc = disable;
  }
  const res: any = await operateFunc({
    ids: ids.value
  });
  if (res.code === "0") {
    message(res.message, {
      type: "success"
    });
    onSearch({});
  }
};

const storeDrawer = ref(null);
const handleAdd = async () => {
  storeDrawer.value.show();
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
  storeDrawer.value.show(row.id);
};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  selectedUser.value = selection;
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
