<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-7 14:07:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime:  2023-11-7 14:07:28
 * @FilePath: src\views\page\area\divisionList\components\divisionDetailDialog.vue
 * @Description: 国家区域管理-表单
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
    class="body"
  >
    <el-form
      :model="divisionForm"
      label-width="150px"
      label-position="top"
      v-loading="loading"
    >
      <el-form-item
        v-if="divisionForm.parent_name != ''"
        label="上一级地区"
        required
      >
        <el-input readonly v-model="divisionForm.parent_name" disabled />
      </el-form-item>
      <el-form-item required>
        <template v-slot:label
          >区域名称
          <el-tooltip
            class="item"
            effect="dark"
            content="仅填写本级区域名称即可，如：在广东省下新增广州市，则仅输入广州"
            placement="right"
          >
            <IconifyIconOffline :icon="InfoFilled" />
          </el-tooltip>
        </template>
        <el-input
          v-model="divisionForm.name"
          placeholder="区域名称"
          :disabled="formType == 'view'"
        />
      </el-form-item>

      <el-form-item label="区域行政编号" required>
        <el-input
          v-model="divisionForm.code"
          placeholder="区域名称"
          :disabled="formType == 'view'"
        />
      </el-form-item>

      <el-form-item label="地区分类" required>
        <el-select
          v-model="divisionForm.region_type"
          class="w-full"
          placeholder="请选择地区分类"
          :disabled="formType == 'view'"
        >
          <el-option
            v-for="item in region_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template v-slot:footer v-if="formType != 'view'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="loading"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import InfoFilled from "@iconify-icons/ep/info-filled";

import {
  newStoreConf,
  storeDivision,
  editDivision
} from "@/geto-components/GetoMspPage/api/base/divisionList.ts";

const dialogVisible = ref(false);
const title = ref("");
const loading = ref(false);
const formType = ref("add");
const region_options = ref([]);
const divisionForm: any = reactive({
  parent_name: "",
  pcode: 0,
  name: "",
  code: "",
  region_type: ""
});

const getConf = () => {
  newStoreConf().then((res: any) => {
    // console.log("res", res);
    region_options.value = res.data.region_type;
  });
};
const show = (data: any, form_type: string) => {
  dialogVisible.value = true;
  formType.value = form_type;
  divisionForm.parent_name = data.name;
  divisionForm.pcode = data.code;
  if (form_type == "eidt" || form_type == "view") {
    if (form_type == "view") {
      title.value = "区域信息详情";
    } else {
      title.value = "编辑区域信息";
    }
    divisionForm.id = data.id;
    divisionForm.name = data.name;
    divisionForm.code = data.code;
    divisionForm.region_type = data.region_type;
  } else {
    title.value = "新增区域信息";
    divisionForm.name = "";
    divisionForm.code = "";
    divisionForm.region_type = "";
  }
  getConf();
};

const handleSubmit = async () => {
  let callFunction = storeDivision;
  let msg = "新增成功";
  if (formType.value == "edit") {
    callFunction = editDivision;
    msg = "编辑成功";
  }
  callFunction(divisionForm).then((res: any) => {
    if (res.code == "0") {
      ElMessage({
        showClose: true,
        message: msg,
        type: "success"
      });
      afterSubmit();
    }
  });
};
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  dialogVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show
});
</script>

<style lang="scss" scoped></style>
