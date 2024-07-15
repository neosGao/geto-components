<template>
  <div>
    <el-button plain @click="show" class="ml-1">绑定用户</el-button>
    <el-drawer v-model="drawer" size="80%">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div v-loading="loading">
          <el-row>
            <el-col :span="24">
              <el-form
                :inline="true"
                :model="query_form"
                class="demo-form-inline"
              >
                <el-form-item label="姓名">
                  <el-input v-model="query_form.name" clearable />
                </el-form-item>
                <el-form-item label="工号">
                  <el-input v-model="query_form.employee_id" clearable />
                </el-form-item>
                <el-form-item label="公司">
                  <el-input v-model="query_form.company_name" clearable />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="query_form.email" clearable />
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="query_form.status" clearable>
                    <el-option
                      v-for="item in status_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSearch()"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <div>
                <el-table
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  height="600"
                  @selection-change="handleSelectionChange"
                  v-loading="table_loading"
                >
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column label="序号" width="55" align="center">
                    <template v-slot="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="姓名"
                    width="100"
                    align="center"
                  />
                  <el-table-column
                    prop="employee_id"
                    label="工号"
                    width="180"
                    align="center"
                  />
                  <el-table-column
                    prop="company_name"
                    label="公司"
                    width="180"
                    align="center"
                  />
                  <el-table-column
                    prop="department_name"
                    label="部门"
                    width="180"
                    align="center"
                  />
                  <el-table-column
                    prop="group_name"
                    label="组别"
                    width="180"
                    align="center"
                  />
                  <el-table-column prop="email" label="邮箱" align="center" />
                  <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    width="80"
                    fixed="right"
                  >
                    <template #default="{ row }">
                      <el-tag :type="row.status == 1 ? 'success' : 'warning'">{{
                        row.status == 1 ? "启用" : "禁用"
                      }}</el-tag>
                    </template>
                  </el-table-column>
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
            </el-col>
            <el-col :span="12">
              <el-radio-group v-model="form.bind_type" class="ml-4">
                <el-radio :label="2" size="large">覆盖</el-radio>
                <el-radio :label="1" size="large">追加</el-radio>
              </el-radio-group>
              <el-transfer
                v-model="role_ids"
                filterable
                :filter-method="filterMethod"
                :titles="['未选中', '已选中']"
                :data="role_list"
                :props="{
                  key: 'value',
                  label: 'label',
                  disabled: 'disabled'
                }"
              />
            </el-col>
          </el-row>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick"> 取消 </el-button>
          <el-button type="primary" @click="confirmClick"> 提交 </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  bindUser,
  bindUserConf
} from "@/geto-components/GetoMspPage/api/role-list";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";

const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const loading = ref(false);
const table_loading = ref(false);
const query_form = ref({
  name: "",
  employee_id: "",
  company_name: "",
  department_name: "",
  group_name: "",
  email: "",
  status: "",
  page: 1,
  page_size: 50
});
const status_options = ref([
  { label: "启用", value: 1 },
  { label: "禁用", value: 2 }
]);
const tableData = ref([]);
const total = ref(0);
interface Option {
  value: number;
  label: string;
  disabled: boolean;
}
const role_list = ref<Option[]>([]);
const role_ids = ref([]);
const form = ref({
  user_ids: [],
  bind_role_ids: [],
  bind_type: 2
});

// 打开抽屉
const show = async () => {
  drawer.value = true;
  resetForm();
  handleSearch();
};
// 关闭抽屉
const cancelClick = async () => {
  drawer.value = false;
};
const handleSearch = async (user_id = 0, handle_select = false) => {
  const query = cloneDeep(query_form.value);
  query.user_id = user_id;
  table_loading.value = true;
  const res: any = await bindUserConf(query);
  if (!handle_select) {
    tableData.value = res.data.bind_role_user_list;
    total.value = res.data.bind_role_user_list.total;
  }

  role_list.value = res.data.bind_role_role_list.un_bind_role_list;
  role_ids.value = res.data.bind_role_role_list.en_bind_role_list;
  table_loading.value = false;
};
const handleSelectionChange = selection => {
  form.value.user_ids = selection.map(item => item.id);
  let user_id = 0;
  if (form.value.user_ids.length == 1) {
    user_id = form.value.user_ids[0];
  }

  handleSearch(user_id, true);
};
const filterMethod = (query, item) => {
  return item.label.indexOf(query) > -1;
};
// 确认
const confirmClick = async () => {
  if (form.value.user_ids.length == 0) {
    message("请先选择用户", { type: "warning" });
    return;
  }
  form.value.bind_role_ids = role_ids.value;
  loading.value = true;

  const res: any = await bindUser(form.value);
  if (res.code != "0") {
    loading.value = false;
    return;
  }
  message(res.data.msg, { type: "success" });
  onSearch(res);
  loading.value = false;
  drawer.value = false;
};
// 重置form
const resetForm = async () => {
  form.value.user_ids = [];
  form.value.bind_role_ids = [];
  form.value.bind_type = 2;

  query_form.value = {
    name: "",
    employee_id: "",
    company_name: "",
    department_name: "",
    group_name: "",
    email: "",
    status: "",
    page: 1,
    page_size: 50
  };
};
const handleSizeChange = (val: number) => {
  query_form.value.page_size = val;
  handleSearch();
};
const handleCurrentChange = (val: number) => {
  query_form.value.page = val;
  handleSearch();
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
