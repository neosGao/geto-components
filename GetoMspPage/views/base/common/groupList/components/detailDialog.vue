<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    :close-on-click-modal="false"
    draggable
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="编码" required>
        <el-input
          v-model="form.code"
          clearable
          :disabled="isEdit"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="组别名称" required>
        <el-input
          v-model="form.name"
          clearable
          placeholder="请输入"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="类型" required>
        <el-select v-model="form.group_type" clearable class="w-full">
          <el-option
            v-for="(item, index) in groupTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="组员" required>
        <el-select
          v-model="form.member"
          clearable
          multiple
          class="w-full"
          @change="handleChangeMember"
        >
          <el-option
            v-for="(item, index) in userOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="组长" required>
        <el-select v-model="form.leader_id" clearable class="w-full">
          <el-option
            v-for="(item, index) in memberSelected"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="经理">
        <el-select v-model="form.manager_id" clearable class="w-full">
          <el-option
            v-for="(item, index) in memberSelected"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import { storeGruop, editGroup } from "@/geto-components/GetoMspPage/api/base/groupList.ts";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false);
const isEdit = ref(false);
const title = ref("");
const form: any = ref({
  // id: 0,
  name: "",
  group_type: "",
  leader_id: "",
  manager_id: "",
  member: []
});
const submitLoading = ref(false);
const groupTypeOptions = ref([]);
const userOptions = ref([]);
const memberSelected: any = ref([]);

// 组员 选中值发生变化时触发
const handleChangeMember = (value: any) => {
  const selected: any = [];
  if (value && value.length > 0) {
    value.map((item: any) => {
      userOptions.value.map((uitem: any) => {
        if (item == uitem.value) {
          selected.push({
            label: uitem.label,
            value: uitem.value
          });
        }
      });
    });
    console.log("selected", selected);
    memberSelected.value = selected;
  } else {
    memberSelected.value = [];
  }
};
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
    title.value = "组别编辑";
    form.value.id = row?.id;
    form.value.code = row?.code;
    form.value.name = row?.name;
    form.value.group_type = row?.group_type_id;
    form.value.leader_id = row?.leader_id;
    form.value.manager_id = row?.manager_id;
    form.value.member = row?.member_id;
    handleChangeMember(form.value.member); // 获取组长和经理下拉选项
  } else {
    title.value = "组别新增";
    form.value.id = 0;
    form.value.name = "";
    form.value.group_type = "";
    form.value.leader_id = "";
    form.value.manager_id = "";
    form.value.member = [];
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
