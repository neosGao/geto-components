<template>
  <div class="w-full">
    <div class="flex items-center pb-4">
      <UploadFile
        class="upload-demo mr-2"
        :configs="{
          accept: ['*'],
          button: {
            name: buttonName,
            style: buttonStyle
          },
          isDrop: false,
          isShowList: false
        }"
        :uploadDisabled="disabled"
        @success="uploadSuccess"
        @error="uploadError"
      />
      <el-button
        v-if="!disabled && emailFunc"
        type="primary"
        @click="hanleEmailUpload"
        >邮件上传</el-button
      >
    </div>
    <el-table
      v-show="files.length > 0"
      :data="files"
      height="180"
      fit
      highlight-current-row
      header-cell-class-name="table-header"
      border
      size="small"
    >
      <el-table-column align="center" label="序号" width="55">
        <template v-slot="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="文件名称" align="center" prop="file_name" />
      <el-table-column label="文件大小" align="center" prop="file_size" />
      <el-table-column label="状态" align="center" prop="file_status" />
      <el-table-column
        label="上传人员"
        align="center"
        prop="create_user_name"
      />
      <el-table-column label="上传时间" align="center" prop="create_time" />
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button
            v-if="!disabled"
            type="danger"
            size="small"
            @click="handleDeleteFile(scope.$index)"
            >删除</el-button
          >
          <el-button
            type="primary"
            @click="downloadFile(scope.row)"
            size="small"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <GetoEmailUpload
      v-if="emailFunc"
      ref="GetoEmailUploadRef"
      :searchFunction="emailFunc"
      :searchParams="emailParams"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useVModel } from "@vueuse/core";
import { ElMessage } from "element-plus";
import UploadFile from "@/geto-components/GetoUploadFile/index.vue";
import GetoEmailUpload from "@/geto-components/GetoEmailUpload/index.vue";

interface Files {
  file_id: string;
  file_name: string;
  file_size: string;
  file_status: string;
  create_user: string;
  create_user_id: string;
  create_user_name: string;
  create_time: string;
}

interface ButtonStyle {
  background: string;
  color: string;
  border: string;
  borderRadius: string;
  fontSize: string;
  padding: string;
  marginLeft: string;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Files[]>,
    default: () => []
  },
  buttonName: {
    type: String,
    default: "上传文件"
  },
  buttonStyle: {
    type: Object as PropType<ButtonStyle>,
    default: () => {
      return {
        background: "#1890ff",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        padding: "8px 16px",
        marginLeft: "0px"
      };
    }
  },

  disabled: {
    type: Boolean,
    default: false
  },
  emailFunc: Function,
  emailParams: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(["upload:modelValue"]);

const files = useVModel(props, "modelValue", emits);

const GetoEmailUploadRef = ref(null);

const downloadFile = (item: any) => {
  window.location.href = item.download ? item.download : item.url;
};
const uploadSuccess = (res: any, fileItem: any) => {
  const { data, code } = res;
  if (code === 200) {
    const file = {
      file_id: fileItem.file_id,
      file_name: fileItem.file_name,
      file_size: bytesToSize(data.size),
      file_status: fileItem.file_status,
      create_user: fileItem.create_user,
      create_user_id: fileItem.create_user_id,
      create_user_name: fileItem.create_user_name,
      create_time: fileItem.create_time,
      download: data.download
    };
    files.value.push(file);
  }
};
const uploadError = () => {
  ElMessage.error("上传失败,请重新上传");
};
const handleDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

const hanleEmailUpload = () => {
  GetoEmailUploadRef.value.show();
};
const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
};
</script>

<style lang="scss" scoped></style>
