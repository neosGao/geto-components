<template>
  <div>
    <el-dialog
      title="导入"
      v-model="dialogTableVisible"
      width="50%"
      @close="handleClose"
    >
      <div class="mb-1">
        <span v-if="!props.importMode" class="part-title">导入文件：</span>
        <div v-if="props.importMode">
          <span class="part-title">导入模式：</span>
          <br />
          <el-radio-group v-model="importWay">
            <el-radio :label="1">追加导入（用于新增数据）</el-radio>
            <el-radio :label="2" :disabled="!props.templateCover"
              >覆盖导入（用于修改数据）</el-radio
            >
          </el-radio-group>
        </div>
        <div>
          <upload-file
            class="ml-1 upload-demo"
            :configs="{
              accept: ['*'],
              button: {
                name: '选择文件'
              },
              isDrop: false
            }"
            @success="handleUploadSuccess"
            @added="handleAdded"
          />
          <el-button
            type="text"
            class="template"
            v-if="props.template && importWay == 1"
            @click="downTemplate"
          >
            下载模板
          </el-button>
          <el-button
            type="text"
            class="template"
            v-if="props.templateCover && importWay == 2"
            @click="downTemplateCover"
          >
            下载模板
          </el-button>
        </div>
        <el-table
          :data="uploadFileList"
          border
          fit
          highlight-current-row
          header-cell-class-name="table-header"
        >
          <el-table-column width="55" label="序号" align="center">
            <template v-slot="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="file_name" label="文件名称" align="center" />
          <el-table-column label="导入进度" width="250" align="center">
            <template v-slot>
              <div v-for="(item, index) in taskList" :key="index">
                <el-progress
                  :percentage="item.percent"
                  v-if="item.status"
                  :status="item.status"
                >
                  <el-button
                    text
                    :type="item.status == 'success' ? 'success' : 'danger'"
                    >{{
                      item.status == "success" ? "导入成功" : "导入失败"
                    }}</el-button
                  >
                </el-progress>
                <el-progress :percentage="item.percent" v-else />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template v-slot="scope">
              <el-button
                type="danger"
                size="small"
                text
                @click="handleRemove(scope.row)"
                >删除</el-button
              >
              <el-button
                class="close-ml"
                type="primary"
                size="small"
                text
                @click="handleDowload(scope.row.file_id)"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 导入后的二级操作插槽 -->
      <div>
        <slot name="extendOperate" ref="extendOperate" />
      </div>
      <div>
        <span class="part-title">导入历史：</span>
        <el-table
          :data="importLogs"
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
          <el-table-column label="文件名称" align="center">
            <template v-slot="scope">
              <el-link
                v-if="scope.row.import_file_name"
                :underline="false"
                type="primary"
                @click="handleDowload(scope.row.import_file_id)"
                >{{ scope.row.import_file_name ?? "" }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="create_user_name"
            label="导入用户"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="导入时间"
            align="center"
            width="160"
          />
          <el-table-column label="导入模式" v-if="props.importMode" align="center">
            <template v-slot="scope">
              <p
                v-if="scope.row.import_way == 1"
                :underline="false"
                type="primary"
              >
                追加导入
              </p>
              <p
                v-if="scope.row.import_way == 2"
                :underline="false"
                type="primary"
              >
                覆盖导入
              </p>
            </template>
          </el-table-column>
          <el-table-column label="导入状态" align="center">
            <template v-slot="scope">
              <p v-if="scope.row.status == 3">
                <el-text type="success">{{
                  scope.row.status_info.success
                    ? scope.row.status_info.success
                    : ""
                }}</el-text>
              </p>
              <p v-if="scope.row.error_report_file_id">
                <el-text type="danger">{{
                  scope.row.status_info.error
                }}</el-text>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template v-slot="scope">
              <el-button
                v-if="scope.row.error_report_file_id"
                type="text"
                @click="handleDowload(scope.row.error_report_file_id)"
                >导入报告下载</el-button
              >
              <el-button v-else-if="scope.row.status == 3" type="success" text
                >导入成功</el-button
              >
              <el-popover
                v-else-if="scope.row.status == 4"
                placement="top-start"
                title="错误信息"
                :width="200"
                trigger="hover"
                :content="scope.row.res_arr[0]"
              >
                <template #reference>
                  <el-button type="danger" text>导入失败</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleUpload" :loading="loading"
            >开始导入</el-button
          >
          <el-button @click="handelReLog">刷新导入记录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getTokenStr } from "@/utils/auth";
import { message } from "@/utils/message";
import { importExcelList, taskFail } from "./../GetoApi/taks";
import { fileDetail } from "./../GetoApi/file";
import UploadFile from "../GetoUploadFile/index.vue";

const props = defineProps({
  template: {
    type: String,
    default: () => ""
  },
  templateCover: {
    type: String,
    default: () => ""
  },
  class: {
    type: String,
    default: () => ""
  },
  import_func: {
    type: Function,
    default: () => {}
  },
  import_params: {
    type: Object,
    default: () => {}
  },
  importMode: {
    type: Boolean,
    default: () => true
  }
});
const dialogTableVisible = ref(false);
const loading = ref(false);
const uploadFileList = ref([]);
const taskList = ref([]);
const headers = ref({});
const action = ref("");
const importLogs = ref([]);
const timer = ref(null);
const importFunction = ref(props.import_func);
const uploadParams = ref({});
const importWay = ref(1); // 导入方式：1：追加 2：覆盖
const emit = defineEmits(["onSearch"]);
const env = import.meta.env;

const show = () => {
  const env = import.meta.env;
  if (env.MODE == "development") {
    headers.value["X-User-Id"] = 1;
  }
  headers.value.Authorization = "Bearer " + getTokenStr();
  action.value = env.VITE_API_PROXY_HOST + "/common/file/singleFileUpload";
  dialogTableVisible.value = true;
  uploadFileList.value = [];
  taskList.value = [];
  // 获取导入记录
  getImportLog(true);
};
const handleUploadSuccess = (res, file_item) => {
  uploadFileList.value = [];
  taskList.value = [];
  message("上传成功！", { type: "success" });
  uploadFileList.value.push({
    file_id: file_item.file_id,
    file_name: file_item.file_name
  });
};
const handleAdded = fileObj => {
  emit("added", fileObj);
};
const getImportLog = flag => {
  // 获取导入历史
  importLogs.value = [];
  // api未引入
  importExcelList({
    class: props.class
  }).then(response => {
    importLogs.value = response.data;
    if (show && importLogs.value.length > 0) {
      const task = importLogs.value[0];
      if (task.status >= 3) {
        return;
      }
      if (!flag) {
        uploadFileList.value.push({
          file_id: task.import_file_id,
          file_name: task.import_file_name
        });
      }
    }
  });
};
const loop = flag => {
  for (const index in taskList.value) {
    // 任务未执行
    if (taskList.value[index].task_status == 0) {
      handel(index, taskList.value[index], flag);
    }
  }
};
const handel = (index, task, flag) => {
  uploadParams.value.file_id = task.fileId;
  uploadParams.value.task_id = task.id;
  uploadParams.value.import_way = importWay.value;

  if (
    props.import_params !== undefined &&
    Object.keys(props.import_params).length
  ) {
    Object.assign(uploadParams.value, props.import_params);
  }

  task
    .importFunction(uploadParams.value)
    .then(response => {
      const res = response.data;
      task.id = res.id;
      task["percent"] = res.percent;
      if (index == 0) {
        uploadFileList.value[0].task_id = task.id;
      }
      if (!res.is_complete) {
        timer.value = setTimeout(() => {
          loop(flag);
        }, 2000);
      } else {
        // 发送执行完成结果
        task.error_report_file_down_url = "";
        task.import_file_down_url = "";
        if (res.error_report_file_id) {
          task.error_report_file_down_url = res.error_report_file_download_url;
        }
        if (res.import_file_name) {
          task.import_file_down_url = res.import_file_download_url;
        }
        getImportLog(flag);
        if (res.is_error) {
          task.task_status = 2;
          task.status = "exception";
          task.percent = 100;
          message("导入异常，请下载错误报告！", { type: "error" });
          return true;
        }

        task.task_status = 1;
        task.status = "success";
        task.percent = 100;
        message("导入成功！", { type: "success" });
      }
    })
    .catch(() => {
      task.task_status = 2;
      task.percent = 100;
      task.status = "exception";
      getImportLog(flag);
    });
};
const handleDowload = fileId => {
  // 下载方法
  fileDetail({
    ids: [fileId]
  }).then(response => {
    for (const index in response.data) {
      const a = document.createElement("a");
      a.href = response.data[index].download;
      a.click();
    }
  });
};
const handleRemove = item => {
  uploadFileList.value = [];
  taskList.value = [];
  if (item.task_id) {
    // 删除接口
    taskFail({
      id: item.task_id
    }).then(res => {
      message(res.data.msg, { type: "success" });
      getImportLog();
    });
  }
};
const handleUpload = () => {
  // 开始导入
  if (!importFunction.value) {
    message("没有配置导入方法", { type: "warning" });
    return false;
  }
  if (uploadFileList.value.length < 1) {
    message("请选择导入文件", { type: "warning" });
    return false;
  }
  const fileInfo = uploadFileList.value[0];
  taskList.value = [];
  taskList.value.push({
    name: fileInfo.file_name,
    fileId: fileInfo.file_id,
    importFunction: importFunction.value,
    status: "",
    task_status: 0,
    format: "",
    error_report_file_down_url: "",
    import_file_down_url: ""
  });
  loop();
};
const handelReLog = () => {
  // 导入记录
  getImportLog(true);
};
const downTemplate = () => {
  // 下载模板
  if (!props.template) {
    message("模板还没上传", { type: "warning" });
    return false;
  }
  // 下载方式存疑
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = env.VITE_PUBLIC_PATH + "template/" + props.template;
  link.setAttribute("download", props.template);
  document.body.appendChild(link);
  link.click();
};
const downTemplateCover = () => {
  // 下载模板
  if (!props.templateCover) {
    message("模板还没上传", { type: "warning" });
    return false;
  }
  // 下载方式存疑
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = env.VITE_PUBLIC_PATH + "template/" + props.templateCover;
  link.setAttribute("download", props.templateCover);
  document.body.appendChild(link);
  link.click();
};
const handleClose = () => {
  clearTimeout(timer.value);
  uploadFileList.value = [];
  importLogs.value = [];
  dialogTableVisible.value = false;
  emit("onSearch");
};
defineExpose({
  // 暴露出子组件方法
  show
});
</script>

<style lang="scss" scoped>
.upload-demo {
  margin-top: 10px;
  margin-left: -1px;
  float: left;
}

.template {
  margin-top: 15px;
  float: right;
}

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
