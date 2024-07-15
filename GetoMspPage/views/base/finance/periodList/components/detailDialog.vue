<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
    draggable
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="年度" required>
        <el-date-picker
          v-model="form.year"
          type="year"
          placeholder="请选择结束日期"
          value-format="YYYY"
        />
      </el-form-item>
      <el-form-item label="开始日期" required>
        <el-date-picker
          v-model="form.start_date"
          type="date"
          placeholder="请选择开始日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="结束日期" required>
        <el-date-picker
          v-model="form.end_date"
          type="date"
          placeholder="请选择结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          v-loading="submitLoading"
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
import { storePeriod } from "@/geto-components/GetoMspPage/api/base/periodList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const title = ref("");
const form = ref({
  year: "",
  start_date: "",
  end_date: ""
});
const submitLoading = ref(false);

const handleSubmit = async () => {
  submitLoading.value = true;
  const res = await storePeriod(form.value);
  submitLoading.value = false;
  if (res.code == "0") {
    ElMessage({
      showClose: true,
      message: "新增成功",
      type: "success"
    });
    afterSubmit();
  }
};
const show = async () => {
  title.value = "新增调整期";
  form.value.year = "";
  form.value.start_date = "";
  form.value.end_date = "";
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
