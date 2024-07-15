<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-7 14:07:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime:  2023-11-7 14:07:28
 * @FilePath: src\views\page\area\countryList\components\CountryDialog.vue
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
      :model="form"
      label-width="150px"
      label-position="top"
      v-loading="loading"
    >
      <el-form-item label="上级地址" required>
        <el-input
          v-model="form.parent_country_name"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="地址名称" required>
        <el-input v-model="form.name" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="国家后缀" required>
        <el-input v-model="form.suffix_code" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="国际区号" required>
        <el-input v-model="form.area_code" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="地区分类">
        <el-select
          v-model="form.region_type"
          placeholder="请选择"
          class="w-full"
          clearable
          filterable
        >
          <el-option
            v-for="item in region_type_conf"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
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
import { newStore, editStore } from "@/geto-components/GetoMspPage/api/base/countryList.ts";

const dialogVisible = ref(false);
const title = ref("");
const loading = ref(false);
const isEdit = ref(false);
const region_type_conf = ref([]);
const form: any = reactive({
  pid: 0,
  parent_country_name: "",
  name: "",
  suffix_code: "",
  area_code: "",
  region_type: ""
});

const show = async (id: number, is_edit: boolean, conf: any, data: any) => {
  isEdit.value = is_edit;
  region_type_conf.value = conf.region_type_conf;
  form.parent_country_name = `${data.parent_country_name}/${data.name}`;
  if (is_edit) {
    form.pid = data.pid;
    form.id = id;
    title.value = "编辑地址";
    form.name = data.name;
    form.suffix_code = data.suffix_code;
    form.area_code = data.area_code;
    form.region_type = data.region_type;
  } else {
    form.pid = data.id;
    title.value = "新增地址";
    form.name = "";
    form.suffix_code = "";
    form.area_code = "";
    form.region_type = "";
  }

  dialogVisible.value = true;
};

const handleSubmit = async () => {
  let callFunction = newStore;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = editStore;
    msg = "编辑成功";
  }
  callFunction(form).then((res: any) => {
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
