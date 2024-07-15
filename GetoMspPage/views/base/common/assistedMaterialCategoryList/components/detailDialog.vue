<template>
  <el-dialog v-model="dialogVisible" :title="title" width="30%" draggable>
    <el-form :model="form" label-width="80px">
      <el-form-item label="分类名称" required>
        <el-input v-model="form.name" clearable :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
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
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  storeCategory,
  editCategory
} from "@/geto-components/GetoMspPage/api/base/assistedMaterialCategoryList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form = ref({
  id: 0,
  name: "",
  desc: ""
});
const submitLoading = ref(false);
const handleSubmit = async () => {
  let callFunction = storeCategory;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = editCategory;
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
    title.value = "辅助资料分类编辑";
    form.value.id = row?.id;
    form.value.name = row?.name;
    form.value.desc = row?.desc;
  } else {
    title.value = "辅助资料分类新增";
    form.value.id = 0;
    form.value.name = "";
    form.value.desc = "";
  }
  dialogVisible.value = true;
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

<style scoped></style>
