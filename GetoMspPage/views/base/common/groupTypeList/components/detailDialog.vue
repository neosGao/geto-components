<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
    draggable
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="类型" required>
        <el-input
          v-model="form.name"
          clearable
          placeholder="请输入"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_GROUP_TYPE_STORE'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_GROUP_TYPE_EDIT'"
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
import { storeGruopType, editGroupType } from "@/geto-components/GetoMspPage/api/base/groupTypeList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  // id: 0,
  name: ""
});
const submitLoading = ref(false);
const groupTypeOptions = ref([]);
const userOptions = ref([]);

const handleSubmit = async () => {
  let callFunction = storeGruopType;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = editGroupType;
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
    title.value = "组别类型编辑";
    form.value.id = row?.id;
    form.value.name = row?.name;
  } else {
    title.value = "组别类型新增";
    form.value.id = 0;
    form.value.name = "";
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
  show,
  groupTypeOptions,
  userOptions
});
</script>

<style scoped></style>
