<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-15 15:25:45
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-12.26 14:03:04
 * @FilePath: src\geto-components\GetoUploadList
 * @Description: 上传文件组件
 *
 * Copyright (c) gwj, All Rights Reserved.
-->
<template>
  <div class="w-full">
    <upload-file
      class="mb-2 upload-demo"
      :configs="{
        accept: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
        button: {
          name: props.fileConfig.buttonName ?? '上传图片',
          style: props.fileConfig.buttonStyle ?? {
            background: '#1890ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            padding: '8px 16px',
            marginLeft: '0px'
          }
        },
        isDrop: false,
        isShowList: false
      }"
      :uploadDisabled="props.fileConfig.uploadDisabled || false"
      @success="handleUploadImgSuccess"
      @added="handleUploadImgAdded"
      @error="handleUploadImgError"
    />
    <div class="split_content" />
    <div class="img-content">
      <div
        class="img-hover"
        v-for="(item, index) in props.fileList"
        :key="index"
      >
        <el-image
          style="width: 100%; height: 100%"
          :title="`点击预览 ${item.fileName}`"
          :src="item.download"
          :preview-src-list="[item.download]"
        />
        <IconifyIconOffline
          :icon="CircleClose"
          v-if="props.fileList.length > 0 && !props.fileConfig.uploadDisabled"
          class="close-img"
          @click.stop="handleDeleteImg(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UploadFile from "@/geto-components/GetoUploadFile/index.vue";
import CircleClose from "@iconify-icons/ep/circle-close";

// 定义发射给父组件的事件
const emits = defineEmits([
  "handleUploadImgSuccess",
  "handleUploadImgAdded",
  "handleUploadImgError",
  "handleDeleteImg"
]);

const props = defineProps({
  fileConfig: {
    type: Object,
    default: () => {}
  },
  fileList: {
    type: Array<any>,
    default: () => []
  }
});
// 删除文件
const handleDeleteImg = (index: number) => {
  // 同步删除表单的
  emits("handleDeleteImg", index);
};
// 文件下载
const downloadFile = (item: any) => {
  window.location.href = item.download ? item.download : item.url;
};
// 上传成功的回调
const handleUploadImgSuccess = (res: any, fileItem: any) => {
  emits("handleUploadImgSuccess", res, fileItem);
};
// // 点击上传时的回调
const handleUploadImgAdded = () => {
  emits("handleUploadImgAdded");
};
// 上传失败的回调
const handleUploadImgError = () => {
  emits("handleUploadImgError");
};
const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1000, // or 1024
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};
</script>

<style lang="scss" scoped>
.split_content {
  width: 100%;
  height: 1px;
}
.img-content {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  .img-hover {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 5px 5px 5px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
  }
  .close-img {
    display: none;
    position: absolute;
    right: 5px;
    top: 5px;
    color: red;
    font-size: 20px;
    z-index: 999;
    cursor: pointer;
  }
  .img-hover:hover .close-img {
    display: block;
  }
}
</style>
