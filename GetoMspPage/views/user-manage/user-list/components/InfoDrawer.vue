<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>用户详情</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" v-model="form" label-width="100px">
            <el-form-item label="主数据编码">
              <el-input v-model="form.main_code" readonly />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.name" readonly />
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="form.work_id" readonly />
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="form.gender" readonly />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="form.mobile" readonly />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" readonly />
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="form.status" readonly />
            </el-form-item>
            <el-form-item label="是否授权">
              <el-input v-model="form.is_auth" readonly />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getInfo } from "@/geto-components/GetoMspPage/api/userManage/user-list";

// const emit = defineEmits(["onSearch"]);
const drawer = ref(false);
const loading = ref(false);
const form = ref({
  id: 0,
  main_code: "",
  name: "",
  work_id: "",
  gender: "",
  mobile: "",
  email: "",
  status: "",
  is_auth: "",
  avatar: ""
});

// 打开抽屉
const show = async (id = 0) => {
  drawer.value = true;
  const res: any = await getInfo({ id: id });
  const data = res.data;

  form.value.id = data.id;
  form.value.main_code = data.main_code;
  form.value.name = data.name;
  form.value.work_id = data.work_id;
  form.value.gender = data.gender;
  form.value.mobile = data.mobile;
  form.value.email = data.email;
  form.value.status = data.status;
  form.value.is_auth = data.is_auth;
  form.value.avatar = data.avatar;
};

// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};

defineExpose({
  show
});
</script>
