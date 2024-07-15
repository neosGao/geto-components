<template>
  <div>
    <el-dialog
      v-model="dialog_visible"
      title="查看配置"
      :before-close="handleClose"
      width="80%"
    >
      <div v-loading="loading">
        <el-text type="primary">主数据相关表</el-text>
        <el-table
          :data="table_data"
          border
          class="mb-5"
          max-height="300"
          :row-class-name="tableRowClassName"
          header-cell-class-name="table-header"
        >
          <el-table-column
            label="序号"
            type="index"
            width="55"
            align="center"
          />
          <el-table-column
            prop="source_service"
            label="源服务"
            width="80"
            align="center"
          />
          <el-table-column prop="source_table" label="源表名" align="center" />
          <el-table-column
            prop="source_table_sql"
            label="源表结构"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-button link type="primary" @click="handleShowSql(row)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="source_table_total_rows"
            label="源表行数"
            width="100"
            align="center"
          />
          <el-table-column
            prop="source_table_last_update_at"
            label="源表最后更新时间"
            width="180"
            align="center"
          />
          <el-table-column prop="table" label="表名" align="center" />
          <el-table-column label="表结构" align="center" width="100">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleShowSql(row)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="table_total_rows"
            label="表行数"
            width="100"
            align="center"
          />
          <el-table-column
            prop="table_last_update_at"
            label="最后更新时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="table_last_update_at"
            label="修复"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleFix(row, 1)"
                >增量</el-button
              >
              <el-button
                type="primary"
                link
                size="small"
                @click="handleFix(row, 2)"
                >全量</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-text type="primary">接口埋点</el-text>
        <el-table
          :data="table_api_data"
          border
          max-height="300"
          header-cell-class-name="table-header"
        >
          <el-table-column
            label="序号"
            type="index"
            width="55"
            align="center"
          />
          <el-table-column prop="url" label="同步路由" align="center" />
          <el-table-column
            prop="method"
            label="请求方式"
            width="180"
            align="center"
          />
        </el-table>
        <SqlDialog ref="sqlDialog" />
      </div>
    </el-dialog>
    <FixDialog
      ref="fixDialog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="loadConfig"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import SqlDialog from "./SqlDialog.vue";
import FixDialog from "./FixDialog.vue";

const props = defineProps({
  getMdConfingApi: {
    type: Function,
    required: true
  },
  syncTaskConfig: {
    type: Object,
    required: true
  }
});

const dialog_visible = ref(false);
const loading = ref(false);
const table_data = ref([]);
const table_api_data = ref([]);
const path = ref("");
const show = async (path_value: string) => {
  path.value = "";
  path.value = path_value;
  dialog_visible.value = true;
  loadConfig();
};
const loadConfig = async () => {
  loading.value = true;
  props
    .getMdConfingApi({ path: path.value })
    .then((res: any) => {
      table_data.value = res.data.table_data;
      table_api_data.value = res.data.table_api_data;
    })
    .finally(() => {
      loading.value = false;
    });
};
const sqlDialog = ref(null);
const handleShowSql = (row: any) => {
  sqlDialog.value.show(row.source_table_sql, row.table_sql);
};
const handleClose = () => {
  dialog_visible.value = false;
};
const tableRowClassName = ({ row }) => {
  if (row.source_table_total_rows !== row.table_total_rows) {
    return "warning-row";
  }

  return "";
};
const fixDialog: any = ref(null);
const sync_task_config: any = ref({
  task_class: props.syncTaskConfig.task_class,
  sync_func: props.syncTaskConfig.sync_func,
  path: props.syncTaskConfig.path,
  relation_table: [],
  async: true
});
const handleFix = (row: any, type: number) => {
  sync_task_config.value.type = type;
  sync_task_config.value.relation_table = [row.source_table];

  fixDialog.value.show();
};

defineExpose({
  show
});
</script>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>
