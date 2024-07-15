<template>
  <div>
    <el-button
      plain
      @click="show()"
      v-auth="'OPERATE_PERMISSION_ROLE_LIST_STORE'"
      >新增</el-button
    >
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ !is_edit ? "新增角色" : "编辑角色" }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" :model="form" label-width="100px">
            <el-form-item label="名称" required>
              <el-input v-model="form.name" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="系统内置角色"
              v-auth="'OPERATE_PERMISSION_ROLE_LIST_SET_SYSTEM_SET'"
            >
              <el-switch
                v-model="form.is_system_set"
                :disabled="is_edit"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="启用">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
          <el-button type="primary" @click="confirmClick" v-if="!is_edit">
            提交
          </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
            v-if="is_edit && hasAuth('OPERATE_PERMISSION_ROLE_LIST_EDIT')"
          >
            编辑
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  storeRole,
  roleInfo,
  editRole
} from "@/geto-components/GetoMspPage/api/role-list";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";

const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const is_edit = ref(false);
const loading = ref(false);
const form = ref({
  id: 0,
  name: "",
  remark: "",
  is_system_set: 0,
  status: 1
});

// 打开抽屉
const show = async (id = 0) => {
  drawer.value = true;
  resetForm();

  if (id > 0) {
    is_edit.value = true;
    const res: any = await roleInfo({ id: id });
    const data = res.data;
    form.value.id = id;
    form.value.name = data.name;
    form.value.remark = data.remark;
    form.value.is_system_set = data.is_system_set;
    form.value.status = data.status;
  }
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
// 确认
const confirmClick = async () => {
  loading.value = true;
  let operateFunc = storeRole;
  if (form.value.id) {
    operateFunc = editRole;
  }
  const res: any = await operateFunc(form.value).finally(() => {
    loading.value = false;
  });
  message(res.data.msg, { type: "success" });
  onSearch(res);
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  is_edit.value = false;
  form.value.id = 0;
  form.value.name = "";
  form.value.remark = "";
};
// 搜索事件
const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};

defineExpose({
  show
});
</script>
