<template>
  <div>
    <el-upload
      v-bind="$attrs"
      class="upload-demo"
      v-model:file-list="fileListOut"
      ref="upload"
      :list-type="listType"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemove"
      :http-request="customRequest"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :limit="props.limit"
      :multiple="props.multiple"
      :on-exceed="handleExceed"
      :show-file-list="props.showFileList"
    >
      <el-button type="primary" v-if="props.buttonName && !readonly">{{
        props.buttonName
      }}</el-button>
      <template #tip v-if="props.tips">
        <div class="el-upload__tip">
          {{ props.tips }}
        </div>
      </template>
      <!-- 自定义内容模块 -->
      <slot />
    </el-upload>
    <!-- 图片预览 -->
    <el-dialog v-model="dialogVisible" v-if="listType == 'picture-card'">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <!-- 其他展示用插槽 -->
    <slot name="fileList" :fileList="fileListOut" />
  </div>
</template>

<script setup lang="ts">
import { getTokenStr } from "@/utils/auth";
import { getFileUploadSingleStrategy } from "./upload";
import { message } from "@/utils/message";
import { ref, nextTick } from "vue";
import type {
  UploadProps,
  UploadRawFile,
  UploadRequestHandler
} from "element-plus";
import { genFileId } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
defineOptions({
  name: "GetoSingleUpload",
  inheritAttrs: false // 防止父组件的属性被默认继承
});
type listTypeString = "text" | "picture" | "picture-card";
const emits = defineEmits(["handleSuccess", "handleError", "beforeRemove"]); // 定义发射给父组件的事件
const props = defineProps({
  buttonName: {
    type: String,
    default: () => "上传文件"
  },
  tips: {
    type: String,
    default: () => ""
  },
  limit: {
    type: Number,
    default: () => 1
  },
  allowedFormats: {
    type: Array,
    default: () => []
  },
  listType: {
    type: String as () => listTypeString,
    default: () => "text"
  },
  readonly: {
    type: Boolean,
    default: () => false
  },
  showFileList: {
    type: Boolean,
    default: () => true
  },
  replaceSingle: {
    type: Boolean,
    default: () => false
  },
    multiple: {
    type: Boolean,
    default: () => false
  }

});

interface res {
  code?: string;
  data?: any;
  message?: string;
}

const upload = ref(null);
const fileListOut = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const optionsFunc = ref({});
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 文件校验方法
const validateFileFormat = file => {
  // 获取文件名称
  const fileName = file.name.toLowerCase();
  // 检查文件格式是否在允许的列表中
  if (props.allowedFormats.length === 0) return true;
  const isFormatValid = props.allowedFormats.some((format: string) => {
    const lowercaseFormat = format.toLowerCase();
    return fileName.endsWith(`.${lowercaseFormat}`);
  });

  return isFormatValid;
};

const beforeUpload = file => {
  const flag = validateFileFormat(file);
  if (!flag) {
    message("操作失败，上传格式有误", { type: "error" });
  }
  return flag;
};
// 成功回调
const handleSuccess = (response, file, fileList) => {
  console.log("😅 ~ handleSuccess ~ fileList:", fileList);
  if (!response) return;
  file.fileID = response?.fileID;
};
// 失败回调
const handleError = (error, file, fileList) => {
  emits("handleError", error, file, fileList);
};
// 删除回调
const beforeRemove = (file, fileList) => {
  const flag = emits("beforeRemove", file, fileList) as unknown as boolean;
  return flag;
};
// 超出限制回调
const handleExceed = (files, fileList) => {
  if (props.replaceSingle) {
    upload.value.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    nextTick(() => {
      upload.value.handleStart(file);
    });
    // 手动调用自定义上传方法
    const {
      onSuccess,
      onError,
      onProgress,
      action,
      method,
      filename,
      data,
      headers,
      withCredentials
    } = optionsFunc.value as any;
    customRequest({
      file: files[0],
      onSuccess,
      onError,
      action,
      method,
      filename,
      data,
      headers,
      onProgress,
      withCredentials
    });
    return;
  }
  if (fileList.length >= props.limit) {
    message("超出上传文件限制!", { type: "error" });
  }
};
// 单文件上传方法
const customRequest: UploadRequestHandler = async options => {
  optionsFunc.value = cloneDeep(options);
  const { file, onSuccess, onError } = options;
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const headers = {
      token: getTokenStr(),
      Accept: "application/json, text/plain, */*",
      "Content-Type": "multipart/form-data",
      "X-Requested-With": "XMLHttpRequest"
    };
    const mode = import.meta.env.MODE;
    if (mode == "development") {
      headers["X-User-Id"] = 1; // 37
    } else {
      headers["Authorization"] = "Bearer " + getTokenStr();
    }
    const res: res = await getFileUploadSingleStrategy(formData, headers);
    if (res.code !== "0") {
      onError(res.data);
      return;
    }
    onSuccess(res.data);
    if (props.replaceSingle) {
      // 如果我是替换上传，由于onSuccess没有执行，那我需要手动改一下状态
      fileListOut.value = fileListOut.value.map(v => {
        return {
          ...v,
          status: "success"
        };
      });
    }
    emits("handleSuccess", res.data, file);
  } catch (error) {
    message("上传失败，请检查网络！", { type: "error" });
    onError(error);
  }
};
const clearFiles = () => {
  upload.value.clearFiles();
};

defineExpose({
  fileListOut,
  clearFiles
});
</script>
