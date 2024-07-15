<template>
  <div>
    <el-button plain @click="show" class="ml-1">角色用户</el-button>
    <el-drawer v-model="drawer" size="80%">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-form :inline="true" :model="query" class="demo-form-inline">
            <el-form-item label="用户名称">
              <el-input v-model="query.name" clearable />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="query.phone" clearable />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="query.email" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" border style="width: 100%" height="600">
            <el-table-column prop="role_name" label="角色名称" width="180" />
            <el-table-column prop="user_name" label="用户名称" width="180" />
            <el-table-column prop="phone" label="手机" width="180" />
            <el-table-column prop="email" label="邮箱" />
          </el-table>
          <el-pagination
            class="mt-2 float-right"
            background
            layout="total, sizes, prev, pager, next"
            :total="total"
            :page-sizes="[10, 100, 200, 300, 400]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { roleUserList } from "@/geto-components/GetoMspPage/api/role-list";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  ids: {
    type: Array,
    default: () => []
  }
});
const drawer = ref(false);
const loading = ref(false);
const query = ref({
  name: "",
  phone: "",
  email: "",
  role_ids: [],
  page: 1,
  page_size: 10
});
const tableData = ref([]);
const total = ref(0);
const local_ids = ref([]);
// 打开抽屉
const show = async () => {
  if (props.ids.length === 0) {
    message("请选择角色", { type: "warning" });
    return;
  }
  local_ids.value = ref(cloneDeep(props.ids));
  drawer.value = true;
  handleSearch();
};
const handleSearch = async () => {
  query.value.role_ids = local_ids.value;
  const res: any = await roleUserList(query.value);
  tableData.value = res.data.data;
  total.value = res.data.total;
  // resetForm();
};
const handleSizeChange = (val: number) => {
  query.value.page_size = val;
  handleSearch();
};
const handleCurrentChange = (val: number) => {
  query.value.page = val;
  handleSearch();
};
// 重置form
// const resetForm = async () => {
//   local_ids.value = [];
// };

defineExpose({
  show
});
</script>
