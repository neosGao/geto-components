<template>
  <el-drawer v-model="visible" :title="title">
    <template #default>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述" prop="description" placeholder="请输入">
          <el-input
            v-model="form.description"
            type="textarea"
            maxlength="300"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
  formModulesAdd,
  formModulesEdit
} from "@/geto-components/GetoApi/field-list";
import { ElMessage } from "element-plus";

const emit = defineEmits(["confirm"]);

const pageStatus = ref<"add" | "edit">("add");

const visible = ref(false);

const title = ref("新增模板模块");

const formRef = ref(null);

const form = ref({
  name: "",
  description: ""
});
const rules = ref({
  name: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }]
});

const show = (status, detail?: any) => {
  visible.value = true;
  pageStatus.value = status;
  if (status === "edit") {
    title.value = "编辑模板模块";
    form.value = detail;
  }
};

const cancelClick = () => {
  resetForm();
  visible.value = false;
};

const validate = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(valid => {
      if (valid) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
};

const confirmClick = async () => {
  const isValidate = await validate().catch(() => false);
  if (!isValidate) return;
  
  const request = pageStatus.value === "add" ? formModulesAdd : formModulesEdit;
  const result = await request(form.value);
  if (result.code === "0") {
    ElMessage.success(result.message);

    resetForm();
    visible.value = false;
    emit("confirm");
  }
};

const resetForm = () => {
  form.value = {
    name: "",
    description: ""
  };
};

defineExpose({
  show
});
</script>
<style scoped></style>
