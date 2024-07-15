<template>
  <el-dialog
    v-model="dialogVisible"
    title="数据同步"
    @closed="onCancel"
    width="70%"
  >
    <div>
      <div v-if="type == 1">
        <el-alert
          title="增量范围没有设置，默认取当前主数据关联数据表的最后更新时间"
          type="warning"
          :closable="false"
        />
      </div>
      <div>
        <span class="float-left mt-2.5">同步方式</span>
        <el-radio-group v-model="type" class="ml-4">
          <el-radio :label="1" size="large">增量</el-radio>
          <el-radio :label="2" size="large">全量</el-radio>
        </el-radio-group>
      </div>
      <div class="mb-2" v-if="type == 1">
        <span class="float-left mt-1.5">增量范围</span>
        <el-date-picker
          style="width: 300px"
          class="ml-4"
          v-model="time_range"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      <el-table :data="tableData" border max-height="300">
        <el-table-column label="#" align="center" width="60">
          <template v-slot="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="80">
          <template v-slot="{ row }">
            <span>
              {{ row.param.params.type == 1 ? "增量" : "全量" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column label="数据类型" align="center" width="150">
          <template v-slot="{ row }">
            <span>
              {{ row.param.params.data_type_name ?? "" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="同步总数" align="center" />
        <el-table-column prop="done" label="已同步" align="center" />
        <el-table-column prop="done" label="进度" align="center" width="300">
          <template v-slot="scope">
            <div v-if="scope.$index == 0">
              <el-progress
                style="padding-top: 2px"
                :percentage="sync_data['progress']"
                :status="sync_data['status_value']"
              />
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status == 0" type="info">等待同步</el-tag>
            <el-tag v-if="scope.row.status == 1">正在同步</el-tag>
            <el-tag
              v-if="scope.row.status == 3 && !scope.row.result.is_error"
              type="success"
              >同步完成</el-tag
            >
            <el-tag
              v-if="scope.row.status == 4 || scope.row.result.is_error"
              type="danger"
              >同步失败</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="结果" align="center" show-overflow-tooltip>
          <template v-slot="scope">
            <span v-if="scope.row.result?.error">
              {{ scope.row.result.error.message ?? "" }}
            </span>
            <span
              v-if="scope.row.result.is_error === false && scope.row.done > 0"
            >
              {{ "同步成功：" + scope.row.done + "条数据" }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleSync" type="primary"> 同步 </el-button>
        <el-button @click="handleRefresh"> 刷新 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getTaskList } from "./../GetoApi/taks";
defineOptions({
  name: "GetoSyncDataDailog"
});
const props = defineProps({
  syncTaskConfig: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(["onCancelClick"]); // 定义发射给父组件的事件
const dialogVisible = ref(false);
const onCancel = () => {
  emits("onCancelClick");
  dialogVisible.value = false;
};
// --------------------------------------------------------------导出列表部分开始-----------------------------------------------------------------
const re_loading = ref(false);
const tableData = ref([]);
const loading = ref(false);
const timeOut = ref<any>(null);
const sync_data = ref<any>({
  progress: 0,
  total: 0,
  done: 0,
  status: 0,
  status_value: ""
});
const type = ref(1);
const time_range = ref("");

const show = () => {
  dialogVisible.value = true;
  search();
};
const handleSync = async () => {
  loading.value = true;
  const form = {
    type: type.value,
    time_range: time_range.value,
    path: props.syncTaskConfig.path,
    async: true
  };
  const res: any = await props.syncTaskConfig.sync_func(form);
  if (res.code != "0") {
    loading.value = false;
    return;
  }

  search();
};

const search = () => {
  loading.value = true;
  const opearteFunction = getTaskList; //record为请求方法
  opearteFunction({
    class: props.syncTaskConfig.task_class
  })
    .then(response => {
      tableData.value = response.data;
      if (tableData.value.length < 1) {
        return false;
      }
      sync_data.value = tableData.value[0];
      if (sync_data.value.status > 2) {
        sync_data.value["progress"] = 100;
      }
      if (sync_data.value.total != 0 && sync_data.value.status < 3) {
        const progress = (sync_data.value.done / sync_data.value.total) * 100;
        sync_data.value["progress"] = progress.toFixed(2);
      }
      sync_data.value.status_value = "";
      if (sync_data.value.status_name == "失败") {
        sync_data.value["status_value"] = "exception";
      }
      if (sync_data.value.status != 3 && sync_data.value.status != 4) {
        timeOut.value = setTimeout(search, 1000);
      }
    })
    .finally(() => {
      re_loading.value = false;
    });
};

const handleRefresh = () => {
  re_loading.value = true;
  search();
};
// --------------------------------------------------------------导出列表部分结束-----------------------------------------------------------------
defineExpose({
  // 暴露出子组件方法
  show
});
</script>
<style>
.el-dialog__body {
  padding-top: 0px;
}
</style>
