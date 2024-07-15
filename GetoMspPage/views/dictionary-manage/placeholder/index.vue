<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      searchAuth="OPERATE_LANGUAGE_TRANSLATE_SEARCH"
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
          @click="handleStore"
          v-auth="'OPERATE_LANGUAGE_TRANSLATE_STORE'"
        >
          新增
        </el-button>
        <el-button
          class="ml-1"
          type="success"
          @click="handlePublish"
          v-auth="'OPERATE_LANGUAGE_TRANSLATE_PUBLISH'"
        >
          发布翻译
        </el-button>
        <el-button
          class="ml-1"
          @click="handleImport"
          v-auth="'OPERATE_LANGUAGE_TRANSLATE_IMPORT'"
        >
          导入
        </el-button>
        <UnableOrEnable
          ref="unableOrEnable"
          class="ml-2 mr-1"
          @onSearch="onSearch"
          :ids="placeholder_ids"
        />
        <el-button
          class="ml-1"
          type="danger"
          @click="handleDelete"
          v-auth="'OPERATE_LANGUAGE_TRANSLATE_DELETE'"
        >
          删除
        </el-button>
      </template>
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status }}</el-tag
        >
      </template>
    </GetoTable>
    <StoreDrawer ref="storeDrawer" @onSearch="onSearch" />
    <GetoImportDialog
      ref="getoImportDialogList"
      template="占位符列表导入模板.xlsx"
      class="MspHelper\DictionaryManage\Task\PlaceholderExcelImport"
      :import_func="importData"
      @onSearch="onSearch"
    />
    <PublishDialog ref="publishDialog" />
  </div>
</template>

<script setup lang="ts">
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList,
  deleteData,
  importData
} from "@/geto-components/GetoMspPage/api/placeholder";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import StoreDrawer from "./components/StoreDrawer.vue";
import UnableOrEnable from "./components/UnableOrEnable.vue";
import GetoImportDialog from "@/geto-components/GetoImportDialog/index.vue";
import PublishDialog from "./components/PublishDialog.vue";

defineOptions({
  name: "placeholder"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "占位符列表",
  url: "/api/msp-helper/dictionarymanage/placeholder/list",
  method: "POST",
  task_class: "MspHelper\\DictionaryManage\\Task\\PlaceholderExcelExport",
  export_func: exportList,
  export_permission: "OPERATE_LANGUAGE_TRANSLATE_EXPORT",
  info_permission: "OPERATE_LANGUAGE_TRANSLATE_INFO",
  useSelection: true,
  useIndex: true,
  span_merge: {
    key: "id", // 合并唯一标识
    merge_column: ["placeholder", "remark"]
  }
};
const searchParams = ref({});
const getoTable = ref();
const ids = ref([]);
const placeholder_ids = ref([]);
const tabName = ref("默认");
// 组件
const storeDrawer = ref();
const getoImportDialogList = ref();
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
const onHighLightClick = row => {
  storeDrawer.value.show(row.id);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  placeholder_ids.value = selection.map(item => item.placeholder_id);
};

const handleStore = () => {
  storeDrawer.value.show();
};

const publishDialog = ref();
const handlePublish = () => {
  publishDialog.value.show();
};

const handleImport = () => {
  getoImportDialogList.value.show();
};

const handleDelete = () => {
  if (placeholder_ids.value.length < 1) {
    message("请选择数据", { type: "warning" });
    return;
  }
  ElMessageBox.confirm("确认删除字段？", "请确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteData({
        placeholder_ids: placeholder_ids.value
      }).then((res: any) => {
        message(res.data.msg, {
          type: "success"
        });
        onSearch({});
      });
    })
    .catch(() => {
      message("已取消删除", {
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
@/geto-components/GetoMspPage/api/placeholder
