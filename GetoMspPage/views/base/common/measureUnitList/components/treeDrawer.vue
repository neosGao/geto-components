<template>
  <el-drawer v-model="drawerVisible" :title="title" width="30%" draggable>
    <el-form :model="form" label-width="80px">
      <el-form-item label="编码" required>
        <el-input
          v-model="form.code"
          clearable
          :disabled="isEdit"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input
          v-model="form.name"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          clearable
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_ASSISTED_MATERIAL_CATEGORY_STORE'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_ASSISTED_MATERIAL_CATEGORY_EDIT'"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeGruop, editGroup } from "@/geto-components/GetoMspPage/api/base/measureUnitList.ts";

import { ElMessage } from "element-plus";
const drawerVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  // id: 0,
  code: 0,
  name: "",
  remark: ""
});
const submitLoading = ref(false);
const handleSubmit = async () => {
  let callFunction = storeGruop;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = editGroup;
    msg = "编辑成功";
  }
  submitLoading.value = true;
  const res = await callFunction(form.value);
  submitLoading.value = false;
  if (res.code == "0") {
    ElMessage({
      showClose: true,
      message: msg,
      type: "success"
    });
    afterSubmit();
  }
};
const show = async (row: any, is_edit: boolean) => {
  isEdit.value = is_edit;
  if (is_edit) {
    title.value = "计量单位分组编辑";
    form.value.id = row?.id;
    form.value.code = row?.code;
    form.value.name = row?.label;
    form.value.remark = row?.remark;
  } else {
    title.value = "计量单位分组新增";
    form.value.code = "";
    form.value.name = "";
    form.value.remark = "";
  }
  drawerVisible.value = true;
};
const emit = defineEmits(["afterSubmitTree"]);
const afterSubmit = () => {
  drawerVisible.value = false;
  emit("afterSubmitTree");
};
defineExpose({
  // 暴露出子组件方法
  show
});
</script>

<style scoped></style>
