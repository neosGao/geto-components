<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
    draggable
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="国家名称" required>
        <el-cascader
          v-model="form.country_id"
          filterable
          :options="countryOptions"
          :props="{ value: 'value', label: 'name', emitPath: false }"
        />
      </el-form-item>
      <el-form-item label="上班时间" required>
        <el-time-picker
          v-model="form.working_time"
          placeholder="请选择上班时间"
          value-format="hh:mm:ss"
          format="hh:mm:ss"
        />
      </el-form-item>
      <el-form-item label="下班时间" required>
        <el-time-picker
          v-model="form.off_work_time"
          placeholder="请选择下班时间"
          value-format="hh:mm:ss"
          format="hh:mm:ss"
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
          v-auth="'OPERATE_BASIC_COUNTRY_WORK_TIME_ADD'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_COUNTRY_WORK_TIME_EDIT'"
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
import { store, edit } from "@/geto-components/GetoMspPage/api/base/countryWorkTimeList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  // id: 0,
  country_id: "",
  working_time: "",
  off_work_time: ""
});
const submitLoading = ref(false);
const countryOptions = ref([]);

const show = async (row: any, is_edit: boolean) => {
  isEdit.value = is_edit;
  if (is_edit) {
    title.value = "国家工作时间编辑";
    form.value.id = row?.id;
    form.value.country_id = row?.country_id;
    form.value.working_time = row?.working_time;
    form.value.off_work_time = row?.off_work_time;
  } else {
    title.value = "国家工作时间新增";
    form.value.id = 0;
    form.value.country_id = "";
    form.value.working_time = "";
    form.value.off_work_time = "";
  }
  dialogVisible.value = true;
};
const handleSubmit = async () => {
  let callFunction = store;
  let msg = "新增成功";
  if (isEdit.value) {
    callFunction = edit;
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
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  dialogVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show,
  countryOptions
});
</script>

<style scoped></style>
