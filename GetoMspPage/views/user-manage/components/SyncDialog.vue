<template>
  <div>
    <el-dialog
      title="数据同步"
      v-model="dialogTableVisible"
      width="50%"
      @close="handleClose"
    >
      <div class="mb-1">
        <span class="part-title">
          当前任务：
          <span v-if="taskInfo.id == undefined">未开始</span>
        </span>

        <div v-if="taskInfo.id != undefined">
          <el-progress
            :percentage="taskInfo.percent"
            v-if="taskInfo.status"
            :status="taskInfo.status_value == 3 ? 'success' : 'danger'"
          >
            <el-button
              text
              :type="taskInfo.status_value == 3 ? 'success' : 'danger'"
            >{{ taskInfo.status_value == 3 ? "成功" : "失败" }}
            </el-button
            >
          </el-progress>
          <el-progress :percentage="taskInfo.percent" v-else/>
        </div>

      </div>
      <div>
        <slot name="extendOperate" ref="extendOperate"/>
      </div>
      <div>
        <span class="part-title">数据同步历史记录：</span>
        <el-table
          :data="taskLogs"
          border
          fit
          highlight-current-row
          header-cell-class-name="table-header"
          :height="200"
          class="mt-1"
        >
          <el-table-column width="55" prop="no" label="序号" align="center">
            <template v-slot="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_user_name"
            label="同步用户"
            align="center"
          />
          <el-table-column prop="create_time" label="同步时间" align="center"/>
          <el-table-column prop="status_name" label="同步状态" align="center"/>
          <el-table-column prop="result" label="结果" align="center">
            <template v-slot="scope">
              {{ scope.row.result.is_error == false ? "" : scope.row.result }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSync" :loading="loading" :disabled="syncBtnDisabled"
          >开始同步</el-button
          >
          <el-button @click="handleHistoryList">刷新同步记录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {message} from "@/utils/message";
import {getTaskList} from "@/geto-components/GetoApi/taks";

const props = defineProps({
  template: {
    type: String,
    default: () => ""
  },
  class: {
    type: String,
    default: () => ""
  },
  task_func: {
    type: Function,
    default: () => {
    }
  }
});
const dialogTableVisible = ref(false);
const loading = ref(false);

const taskInfo = ref({});

const syncBtnDisabled = ref(false);
const taskLogs = ref([]);
const timer = ref(null);
const taskFunction = ref(props.task_func);
const taskParams = ref({});
const emit = defineEmits(["onSearch"]);

const show = () => {
  dialogTableVisible.value = true;
  taskInfo.value = {}
  handleHistoryList();
};

const getInfo = (task) => {
  task.taskFunction({task_id: task.id})
    .then(response => {
      const info = response.data;

      if (info.status == 4) {
        message(info.msg, {type: "error"});
      } else if (info.status == 3) {
        message(info.msg, {type: "success"});
      }

      taskInfo.value.percent = info.percent;

      if (info.status >= 3) {
        taskInfo.value.status_value = info.status;
        taskInfo.value.status = info.status_name;
        syncBtnDisabled.value = false;
      } else {
        setTimeout(getInfo, 1000, task);
      }
    })
};

const handleTaskBegin = async (task) => {
  if (task.id > 0) {
    taskParams.value.task_id = task.id;
  }
  if (
    props.import_params !== undefined &&
    Object.keys(props.import_params).length
  ) {
    Object.assign(taskParams.value, props.import_params);
  }

  await task
    .taskFunction(taskParams.value)
    .then(response => {
      const res = response.data;
      task.id = res.id;
      getInfo(task);
    })
    .catch(() => {
      task.status_value = 4;
      task.percent = 100;
      task.status = "exception";
    });
};

const handleSync = () => {
  taskInfo.value = {
    id: 0,
    status_value: 0,
    status: "",
    percent: 0,
    taskFunction: taskFunction.value,
  }
  handleTaskBegin(taskInfo.value);
  syncBtnDisabled.value = true;
};

const handleHistoryList = async () => {
  await getTaskList({
    class: props.class
  }).then(response => {
    if (response.code == 0) {
      taskLogs.value = response.data;
    }
  });
};

const handleClose = () => {
  clearTimeout(timer.value);
  taskLogs.value = [];
  dialogTableVisible.value = false;
  emit("onSearch");
};

// 暴露出子组件方法
defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

:deep .el-dialog__body {
  padding: 15px 20px;
}

.part-title:before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 14px;
  margin-right: 10px;
  background: #67c23a;
}

.close-ml {
  margin-left: -1px;
}
</style>
