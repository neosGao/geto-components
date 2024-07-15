<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑银行利率"
    width="30%"
    draggable
  >
    <template #footer>
      <el-form :model="form" label-width="100px">
        <el-form-item label="结算年利率">
          <el-input v-model="form.settle_year_rate" />
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          v-auth="'OPERATE_BASIC_DIVISION_CODE_EDIT'"
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
import { rateEdit } from "@/geto-components/GetoMspPage/api/base/bankRateList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const form = ref({
  id: 0,
  settle_year_rate: ""
});
const submitLoading = ref(false);
const handleSubmit = async () => {
  const res = await rateEdit(form.value);
  if (res.code == "0") {
    ElMessage({
      showClose: true,
      message: "编辑成功",
      type: "success"
    });
    afterSubmit();
  }
};
const show = async (id: number, settle_year_rate: string) => {
  form.value.id = id;
  form.value.settle_year_rate = settle_year_rate;
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

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.example-container {
  padding: 1.5rem;
  margin-bottom: 20px;
  height: auto;
  background-color: #fff;
  margin-left: 3.5rem;
}
.explain-container {
  width: auto;
  height: auto;
  padding: 10px;
  margin-bottom: 20px;
}
h2 {
  font-size: 2.2rem;
  font-weight: 600;
  margin-left: 3.5rem;
}
h3 {
  padding-bottom: 0.3rem;
  line-height: 1.25;
  font-size: 1.3rem;
  font-weight: 600;
}
.title {
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>
