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
        <el-button style="margin-left: 12px" @click="handleDelete" type="primary">删除</el-button>
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

    <FieldDesign
      ref="fieldDesignRef"
      v-model:visible="drawer"
      :type="drawerType"
      @confirm="confirmClick"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  fieldChangeStatus,
  fieldDelete,
  listConf,
  fieldExport
} from "@/geto-components/GetoApi/field-list";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import FieldDesign from "./add.vue";
import { ElMessage } from "element-plus";
import { formatDefaultValue } from "@/geto-components/GetoFormDisplay/config";

defineOptions({
  name: "field_list"
});

const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const tabName = ref("");
const init_data_config = {
  title: "字段列表",
  url: "/api/msp-helper/fieldandform/field-config/index",
  method: "POST",
  export_func: fieldExport,
  task_class: "App\\Library\\MspHelper\\FieldAndForm\\Task\\SampleFieldExcelExportTask",
  export_permission: "LIST_BOM_TYPE_BOM_TYPE_LIST_EXPORT",
  useIndex: true,
  useSelection: true,
  info_permission: "LIST_BOM_TYPE_BOM_TYPE_LIST_EXPORT"
};

const getoTable = ref<InstanceType<typeof GetoTable> | null>(null);

const getListConf = async () => {
  const res = await listConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value[0];
  table_conf.value = default_view?.conf.list_columns;
};

const searchParams = ref({});
const onSearch = val => {
  searchParams.value = val;
  getoTable.value?.onClickSearch(searchParams);
};

const fieldDesignRef = ref<InstanceType<typeof FieldDesign>>(null);
const onHighLightClick = row => {
  fieldDesignRef.value?.setForm(row, {
    id: row.id,
    field_name: row.name,
    version_num: row.version_num,
    default_value: formatDefaultValue(
      row.field_type,
      row.field_default_value,
      row.option_interactive_mode
    ),
    placeholder: row.field_placeholder
  });
  drawerType.value = "edit";
  drawer.value = true;
};
const ids = ref<number[]>([]);
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};

const drawer = ref(false);
const drawerType = ref<"add" | "edit">("add");

const handleAdd = () => {
  drawerType.value = "add";
  drawer.value = true;
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

const confirmClick = () => {
  getoTable.value?.onClickSearch(searchParams);
};

onMounted(() => {
  getListConf();
});
</script>
<style scoped></style>
