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
      <template #button-row>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button
          style="margin-left: 12px"
          @click="handleDelete"
          type="primary"
          >删除</el-button
        >
        <el-dropdown
          class="ml-2"
          split-button
          @click="handleDisbleOrEnable(0)"
          @command="handleCommand"
          type="primary"
        >
          禁用
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="enable">启用</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </GetoTable>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import {
  fieldChangeStatus,
  fieldDelete,
  formConf
} from "@/geto-components/GetoApi/field-list";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ElMessage } from "element-plus";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "form_list"
});

const router = useRouter();

const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const tabName = ref("");
const init_data_config = {
  title: "表单列表",
  url: "/api/msp-helper/fieldandform/form-config/index",
  method: "POST",
  export_func: "",
  task_class: "MenuListExcelExportTask",
  export_permission: "LIST_BOM_TYPE_BOM_TYPE_LIST_EXPORT",
  useIndex: true,
  useSelection: true,
  info_permission: "LIST_BOM_TYPE_BOM_TYPE_LIST_EXPORT"
};

const getoTable = ref<InstanceType<typeof GetoTable> | null>(null);

const getListConf = async () => {
  const res = await formConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value[0];
  table_conf.value = default_view?.conf.list_columns;
};

const searchParams = ref({});
const onSearch = val => {
  searchParams.value = val;
  getoTable.value?.onClickSearch(searchParams);
};

const onHighLightClick = row => {
  router.push({
    path: "/field-form-manage/form-template/edit",
    query: {
      id: row.id,
      version_no: row.version_no,
      type: "edit"
    }
  });
};
const ids = ref<number[]>([]);
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};

const handleAdd = () => {
  router.push({
    path: "/field-form-manage/form-template/edit"
  });
};

const handleDelete = async () => {
  if (ids.value.length === 0) {
    ElMessage.error("请选择要删除的数据");
    return;
  }
  if (ids.value.length > 1) {
    ElMessage.error("只能选择一条数据进行删除");
    return;
  }
  const { code, message } = await fieldDelete({
    id: ids.value[0]
  });
  if (code === "0") {
    ElMessage.success(message);
    getoTable.value?.onClickSearch(searchParams);
  }
};

const handleDisbleOrEnable = async status => {
  const { code, message } = await fieldChangeStatus({
    ids: ids.value,
    enable_status: status
  });
  if (code === "0") {
    ElMessage.success(message);
    getoTable.value?.onClickSearch(searchParams);
  }
};

const handleCommand = command => {
  if (command === "enable") {
    handleDisbleOrEnable(1);
  }
};

onMounted(() => {
  getListConf();
  emitter.on("showPageListSave", returnName => {
    tabName.value = returnName;
    getListConf();
  });
});

onActivated(() => {
  getoTable.value?.onClickSearch(searchParams);
});
</script>
<style scoped></style>
