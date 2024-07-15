<template>
  <el-drawer v-model="drawerVisible" :title="title" width="30%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="分类名称" required>
        <el-select
          v-model="form.category_id"
          clearable
          :disabled="isEdit"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in props.categoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" clearable />
      </el-form-item>

      <el-form-item label="创建人" v-if="isEdit">
        <el-input v-model="form.create_user" disabled />
      </el-form-item>
      <el-form-item label="创建时间" v-if="isEdit">
        <el-input v-model="form.create_time" disabled />
      </el-form-item>
      <el-form-item label="最新修改人" v-if="isEdit">
        <el-input v-model="form.update_user" disabled />
      </el-form-item>
      <el-form-item label="最新修改时间" v-if="isEdit">
        <el-input v-model="form.update_time" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button
          v-if="!isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_ASSISTED_MATERIAL_STORE'"
          @click="handleSubmit"
        >
          确定
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          v-loading="submitLoading"
          v-auth="'OPERATE_BASIC_ASSISTED_MATERIAL_EDIT'"
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
import { store, edit } from "@/geto-components/GetoMspPage/api/base/assistedMaterialList.ts";
import { ElMessage } from "element-plus";
const drawerVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  id: 0,
  name: "",
  category_id: "",
  desc: ""
});

const props = defineProps({
  categoryList: {
    type: Array<any>,
    default: () => []
  }
});
const submitLoading = ref(false);
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
const show = async (row: any, is_edit: boolean) => {
  isEdit.value = is_edit;
  if (is_edit) {
    title.value = "辅助资料编辑";
    form.value.id = row?.id;
    form.value.category_id = row?.category_id;
    form.value.name = row?.name;
    form.value.desc = row?.desc;
  } else {
    title.value = "辅助资料新增";
    form.value.id = 0;
    form.value.category_id = "";
    form.value.name = "";
    form.value.desc = "";
  }
  drawerVisible.value = true;
};
const emit = defineEmits(["afterSubmit"]);
const afterSubmit = () => {
  drawerVisible.value = false;
  emit("afterSubmit");
};
defineExpose({
  // 暴露出子组件方法
  show,
  form
});
</script>

<style scoped></style>
