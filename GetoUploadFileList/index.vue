<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-15 15:25:45
 * @LastEditors: 邱永健 qyj@geto.com.cn
 * @LastEditTime: 2024-03-26 14:21:31
 * @FilePath: src\geto-components\GetoUploadList
 * @Description: 上传文件组件
 *
 * Copyright (c) gwj, All Rights Reserved.
-->
<template>
  <div class="w-full">
    <upload-file
      class="mb-2 upload-demo"
      v-if="!props.fileConfig.isHiddenBtn"
      :configs="{
        accept: ['*'],
        button: {
          name: props.fileConfig.buttonName ?? '上传文件',
          style: props.fileConfig.buttonStyle ?? {
            background: '#1890ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            padding: '8px 16px',
            marginLeft: '5px',
            marginBottom: '8px',
            floor: 'left'
          }
        },
        isDrop: false,
        isShowList: false
      }"
      :uploadDisabled="props.fileConfig.uploadDisabled || false"
      @success="handleUploadFileSuccess"
      @added="handleUploadFileAdded"
      @error="handleUploadFileError"
    />
    <el-button
      v-if="props.fileConfig.searchFunction"
      :disabled="props.fileConfig.emailDisabled || false"
      type="primary"
      @click="hanleEmailUpload"
      class="ml-2 mb-2"
      >邮件上传</el-button
    >
    <el-table
      v-if="!props.fileConfig.noFileList"
      :data="props.fileList"
      height="180"
      fit
      highlight-current-row
      header-cell-class-name="table-header"
      border
    >
      <el-table-column align="center" label="序号" width="55">
        <template v-slot="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="文件名称" align="center" prop="fileName" />
      <el-table-column label="文件大小" align="center" prop="sizeName">
        <template v-slot="scope">{{
          isNaN(scope.row.sizeName) ? 0 : bytesToSize(scope.row.sizeName)
        }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="上传时间" align="center" prop="create_time" />
      <!-- 添加自定义列 -->
      <template
        v-if="props.fileConfig && props.fileConfig.columns && props.fileConfig.columns.length > 0"
      >
        <template v-for="(item, index) in props.fileConfig.columns" :key="index">
          <el-table-column :label="item.label" align="center" :prop="item.prop" :width="item.width">
            <template v-slot="scope">
              <slot
                name="tableItem"
                :fileRow="scope.row"
                :fileRindex="scope.$index"
                :fileitem="item"
              />
            </template>
          </el-table-column>
        </template>
      </template>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button
            type="danger"
            @click="handleDeleteFile(scope.$index)"
            v-if="!props.fileConfig.deleteNotShow"
            :disabled="props.fileConfig.deleteDisabled || false"
            >删除</el-button
          >
          <el-button
            type="primary"
            v-if="!props.fileConfig.downloadDisabled"
            @click="downloadFile(scope.row)"
            :disabled="props.fileConfig.downloadDisabled || false"
            >下载</el-button
          >
          <slot name="operateslot" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
    <GetoEmailUpload
      ref="GetoEmailUploadRef"
      :searchFunction="props.fileConfig.searchFunction ?? {}"
      :searchParams="props.fileConfig.searchParams ?? {}"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import UploadFile from "@/geto-components/GetoUploadFile/index.vue";
import GetoEmailUpload from "@/geto-components/GetoEmailUpload/index.vue";
import { downloadByUrl } from "@pureadmin/utils";

// 定义发射给父组件的事件
const emits = defineEmits([
  "handleUploadFileSuccess",
  "handleUploadFileAdded",
  "handleUploadFileError",
  "handleDeleteFile"
]);

const props = defineProps({
  fileConfig: {
    type: Object,
    required: true
  },
  fileList: {
    type: Array,
    default: () => []
  },
  state: {
    //透传参数
    type: Object,
    default: () => {}
  }
});

const GetoEmailUploadRef = ref(null);

// 删除文件
const handleDeleteFile = (index: number) => {
  // 同步删除表单的
  emits("handleDeleteFile", index, props.state);
};
// 文件下载
const downloadFile = (item: any) => {
  // window.location.href = item.download ? item.download : item.url;
  const downloadUrl = item.download ? item.download : item.url;
  downloadByUrl(downloadUrl, item.file_name);
};
// 上传成功的回调
const handleUploadFileSuccess = (res: any, fileItem: any) => {
  emits("handleUploadFileSuccess", res, fileItem, props.state);
};
// // 点击上传时的回调
const handleUploadFileAdded = () => {
  emits("handleUploadFileAdded");
};
// 上传失败的回调
const handleUploadFileError = () => {
  emits("handleUploadFileError");
};
const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1000, // or 1024
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};
const hanleEmailUpload = () => {
  GetoEmailUploadRef.value.show();
};
</script>

<style lang="scss" scoped></style>
