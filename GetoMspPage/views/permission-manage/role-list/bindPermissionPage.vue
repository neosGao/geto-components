<template>
  <div class="dark:text-white geto-step-form">
    <GetoBackBar title="绑定权限" routeName="role_list">
      <template #title>
        <span class="text-sm" style="color: var(--el-text-color-regular)">
          角色：
        </span>
        <el-select
          v-model="form.role_id"
          filterable
          clearable
          placeholder="请选择角色"
          @change="handleChangeRole"
        >
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #extra>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </GetoBackBar>
    <el-row :gutter="5" style="height: 100%">
      <el-col :span="4">
        <GetoTree
          :data="role_tree_data"
          :config="tree_config"
          @handleNodeClick="handleNodeClickRole"
        />
      </el-col>
      <el-col :span="13">
        <div class="button-table">
          <el-input
            v-model="page_query"
            class="mb-2"
            placeholder=""
            :prefix-icon="Search"
            @change="handleFilterPages"
          >
            <template #append>
              <el-select
                v-model="page_select_type"
                style="width: 115px"
                placeholder="设置全部"
                @change="handlePageSelectTypeChange"
              >
                <el-option label="设置全部" :value="0" />
                <el-option label="有权" :value="1" />
                <el-option label="无权" :value="2" />
                <el-option label="禁止" :value="3" />
              </el-select>
            </template>
          </el-input>
          <el-table
            :data="pageTableData"
            border
            height="670"
            empty-text="请点击左侧选择路径获取页面数据"
            style="width: 100%"
            ref="multipleTable"
            @row-click="singleElection"
            highlight-current-row
          >
            <el-table-column label="选中" align="center" width="55">
              <template v-slot="scope">
                <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
                <el-radio
                  class="radio"
                  v-model="templateSelection"
                  :label="scope.row.id"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column label="#" width="50" align="center">
              <template v-slot="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="path_name_str" label="路径" />
            <el-table-column
              prop="name"
              label="页面名称"
              align="center"
              width="160"
            />
            <el-table-column
              prop="hasAuth"
              label="是否有权"
              align="center"
              width="260"
            >
              <template v-slot="scope">
                <el-radio-group v-model="scope.row.status" class="ml-4">
                  <el-radio :label="1">有权</el-radio>
                  <el-radio :label="2">无权</el-radio>
                  <el-radio :label="3">禁止</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="操作权限" align="center" width="100">
              <template v-slot="scope">
                <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
                <el-tag
                  :type="scope.row.is_setting ? 'success' : 'warning'"
                  v-if="form.role_id"
                  >{{ scope.row.is_setting ? "已配置" : "未配置" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="button-table">
          <el-input
            v-model="operate_query"
            class="mb-2"
            placeholder=""
            :prefix-icon="Search"
            @change="handleFilterOperates"
          >
            <template #append>
              <el-select
                v-model="operate_select_type"
                style="width: 115px"
                placeholder="设置全部"
                @change="handleOperateSelectTypeChange"
              >
                <el-option label="设置全部" :value="0" />
                <el-option label="有权" :value="1" />
                <el-option label="无权" :value="2" />
                <el-option label="禁止" :value="3" />
              </el-select>
            </template>
          </el-input>
          <el-table
            :data="buttonTableData"
            border
            empty-text="选中页面数据限获取数据"
            style="width: 100%"
            height="670"
          >
            <el-table-column label="#" width="50" align="center">
              <template v-slot="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作权限名称" align="center" />
            <el-table-column
              prop="hasAuth"
              label="是否有权"
              align="center"
              width="260"
            >
              <template v-slot="scope">
                <el-radio-group v-model="scope.row.status" class="ml-4">
                  <el-radio :label="1">有权</el-radio>
                  <el-radio :label="2">无权</el-radio>
                  <el-radio :label="3">禁止</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div />
  </div>
</template>

<script setup lang="ts">
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import { ref, onMounted } from "vue";
import {
  bindPermissionConf,
  bindPermission
} from "@/geto-components/GetoMspPage/api/role-list";
import { Search } from "@element-plus/icons-vue";
import { message } from "@/utils/message";

const roles = ref([]);
const role_tree_data = ref([]);
const tree_config = ref({
  expandAll: true
});

const checkList = ref([]);
const multipleTable = ref(null);
const templateSelection = ref("");

const page_key = ref("");
const page_query = ref("");
const pageTableData = ref([]);
const page_select_type = ref(0);
const operate_query = ref("");
const operate_select_type = ref(0);
const buttonTableData = ref([]);
const current_path = ref("");

const form = ref({
  role_ids: [],
  role_id: "",
  pages: [],
  operates: []
});
// 获取列表页面配置API
const getPageConfApi = async (page_path = "") => {
  const res: any = await bindPermissionConf({
    role_id: form.value.role_id,
    page_path: page_path,
    page_key: page_key.value,
    page_name: page_query.value,
    operate_name: operate_query.value
  });
  roles.value = res.data.roles;

  return res.data;
};
// 选中角色
const handleChangeRole = () => {
  getPageConfApi().then(res => {
    pageTableData.value = res.pages;
    buttonTableData.value = [];
  });
};
// 路径节点选中
const handleNodeClickRole = data => {
  current_path.value = data.id + "/";
  if (data.level > 1) {
    current_path.value = "/" + data.id + "/";
  }
  getPageConfApi(current_path.value).then(res => {
    pageTableData.value = res.pages;
    buttonTableData.value = [];
  });
  page_select_type.value = 0;
};
// 页面表格单选
const singleElection = row => {
  templateSelection.value = row.id;
  checkList.value = pageTableData.value.filter(item => item.id === row.id);
  operate_select_type.value = 0;
  handleOperateSelectTypeChange();
  handleClickPage(row);
};
// 页面数据点击
const handleClickPage = row => {
  page_key.value = "";
  page_key.value = row.key;
  buttonTableData.value = [];
  getPageConfApi(current_path.value).then(res => {
    buttonTableData.value = res.operates;
  });
};
// 页面搜索
const handleFilterPages = () => {
  getPageConfApi().then(res => {
    pageTableData.value = res.pages;
    buttonTableData.value = [];
  });
};
// 页面权限切换
const handlePageSelectTypeChange = () => {
  pageTableData.value.forEach(item => {
    item.status = page_select_type.value;
  });
};
// 操作搜索
const handleFilterOperates = () => {
  getPageConfApi(current_path.value).then(res => {
    buttonTableData.value = res.operates;
  });
};
// 操作权限切换
const handleOperateSelectTypeChange = () => {
  buttonTableData.value.forEach(item => {
    item.status = operate_select_type.value;
  });
};
// 提交
const submitForm = async () => {
  form.value.role_ids = [form.value.role_id];
  form.value.pages = pageTableData.value.map(item => {
    return {
      page_name: item.name,
      page_key: item.key,
      status: item.status
    };
  });
  form.value.operates = buttonTableData.value.map(item => {
    return {
      operate_name: item.name,
      operate_key: item.key,
      status: item.status
    };
  });
  bindPermission(form.value).then(res => {
    const data: any = res.data;
    message(data.msg, { type: "success" });
    pageTableData.value.forEach(item => {
      if (item.id == templateSelection.value) {
        item.is_setting = true;
      }
    });
  });
};
// 挂载
onMounted(() => {
  getPageConfApi().then(res => {
    role_tree_data.value = res.menus;
    pageTableData.value = res.pages;
    buttonTableData.value = [];
  });
});
</script>

<style lang="scss" scoped>
.button-table {
  width: 100%;
  height: calc(100% - 10px);
  color: rgba(30, 144, 255, 0.8);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}
</style>
