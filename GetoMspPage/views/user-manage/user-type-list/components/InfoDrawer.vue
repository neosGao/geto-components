<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>用户类型详情</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form ref="myForm" v-model="form" label-width="100px">
            <el-form-item label="主数据编码">
              <el-input v-model="form.main_code" readonly />
            </el-form-item>
            <el-form-item label="编码">
              <el-input v-model="form.code" readonly />
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="form.name" readonly />
            </el-form-item>
            <el-form-item label="类别">
              <el-input v-model="form.type" readonly />
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="form.status" readonly />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" readonly />
            </el-form-item>
            <el-form-item label="创建者">
              <el-input v-model="form.create_user" readonly />
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input v-model="form.create_time" readonly />
            </el-form-item>
            <el-form-item label="更新时间">
              <el-input v-model="form.update_time" readonly />
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
import { getInfo } from "@/geto-components/GetoMspPage/api/userManage/user-type-list";

// const emit = defineEmits(["onSearch"]);
const drawer = ref(false);
const loading = ref(false);
const form = ref({
  id: 0,
  main_code: "",
  code: "",
  name: "",
  type: "",
  status: "",
  remark: "",
  create_user: "",
  create_time: "",
  update_time: "",
});

// 打开抽屉
const show = async (id = 0) => {
  drawer.value = true;
  const res: any = await getInfo({ id: id });
  const data = res.data;

  form.value.id = data.id;
  form.value.code = data.code;
  form.value.main_code = data.main_code;
  form.value.name = data.name;
  form.value.type = data.type;
  form.value.status = data.status;
  form.value.remark = data.remark;
  form.value.create_user = data.create_user;
  form.value.create_time = data.create_time;
  form.value.update_time = data.update_time;
};

// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};

// // 重置form
// const resetForm = async () => {
//   form.value.id = 0;
// };

// 搜索事件
// const onSearch = res => {
//   if (res.code != "0") return;
//   emit("onSearch");
// };

defineExpose({
  show
});
</script>
