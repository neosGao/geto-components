<template>
  <div class="dark:text-white geto-step-form">
    <GetoBackBar title="资源权限配置" routeName="role_list">
      <template #title>
        <span class="text-sm" style="color: #f56c6c"> 角色： </span>
        <el-select
          v-model="form.role_id"
          filterable
          clearable
          placeholder="请选择角色"
          @change="loadConfig"
        >
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span
          class="text-sm ml-5"
          style="color: #f56c6c"
          v-if="permission_mode == 'ORG'"
        >
          业务组织：
        </span>
        <el-select
          v-model="form.org_id"
          filterable
          clearable
          placeholder="请选业务组织"
          @change="loadConfig"
          v-if="permission_mode == 'ORG'"
        >
          <el-option
            v-for="item in org_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-radio-group v-model="type" class="ml-5" @change="loadConfig">
          <el-radio :label="1">PC权限</el-radio>
          <el-radio :label="2">Mobile权限</el-radio>
        </el-radio-group>
      </template>
      <template #extra>
        <el-button
          type="primary"
          @click="handleCopyToOrg"
          v-if="permission_mode == 'ORG'"
          v-auth="'OPERATE_PERMISSION_RESOURCE_COPY_TO_ORG'"
          >应用当前配置到其他组织</el-button
        >
        <el-button
          type="primary"
          @click="handleCopyToRole"
          v-auth="'OPERATE_PERMISSION_RESOURCE_COPY_TO_ROLE'"
          >复制权限配置到其他角色</el-button
        >
        <el-button
          type="primary"
          @click="submitForm"
          v-auth="'OPERATE_PERMISSION_RESOURCE_PERMISSION_SUBMIT'"
          >提交</el-button
        >
      </template>
    </GetoBackBar>
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="filter-tree">
          <el-checkbox-group
            v-model="filter_type"
            class="ml-3"
            @change="loadConfig"
          >
            <el-checkbox :label="1">查看有权</el-checkbox>
            <el-checkbox :label="2">查看无权</el-checkbox>
          </el-checkbox-group>
          <GetoTree
            class="!mt-0 tree"
            :data="tree_data"
            :config="tree_config"
            @handleNodeClick="handleNodeClickRole"
          />
        </div>
      </template>
      <template #paneR>
        <!-- 自定义右侧面板的内容 -->
        <el-row :gutter="5" style="height: 100%">
          <el-col :span="16">
            <div class="button-table">
              <el-input
                v-model="page_query"
                class="mb-2"
                placeholder="搜索"
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
                ref="multipleTable"
                @row-click="singleElection"
                highlight-current-row
              >
                <el-table-column align="center" width="55" type="selection" />
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
                  label="权限"
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
          <el-col :span="8">
            <div class="button-table">
              <el-input
                v-model="operate_query"
                class="mb-2"
                placeholder="搜索"
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
                height="670"
                ref="operateTable"
              >
                <el-table-column align="center" width="55" type="selection" />
                <el-table-column label="#" width="50" align="center">
                  <template v-slot="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="操作权限名称"
                  align="center"
                />
                <el-table-column
                  prop="hasAuth"
                  label="权限"
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
      </template>
    </splitpane>
    <div />
    <CopyToOrg
      ref="copyToOrg"
      :org_list="org_list"
      :org_id="form.org_id"
      :role_id="form.role_id"
    />
    <CopyToRole
      ref="copyToRole"
      :role_list="roles"
      :org_id="form.org_id"
      :role_id="form.role_id"
    />
  </div>
</template>

<script setup lang="ts">
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import { ref, onMounted, reactive } from "vue";
import {
  bindPermissionConf,
  bindPermission
} from "@/geto-components/GetoMspPage/api/resource-permission";
import { Search } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import CopyToOrg from "./components/CopyToOrg.vue";
import CopyToRole from "./components/CopyToRole.vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";

defineOptions({
  name: "resource_permission_setting"
});

const permission_mode = ref("ORG");

const settingLR: ContextProps = reactive({
  minPercent: 10,
  defaultPercent: 15,
  split: "vertical"
});

const type = ref(1);
const copyToOrg = ref(null);
const copyToRole = ref(null);
const roles = ref([]);
const org_list = ref([]);
const tree_data = ref([]);
const filter_type = ref([]);
const tree_config = ref({
  expandAll: false
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
const operateTable = ref(null);
const buttonTableData = ref([]);
const current_path = ref("");

const form = ref({
  role_ids: [],
  role_id: "",
  org_id: "",
  pages: [],
  operates: []
});
// 获取列表页面配置API
const getPageConfApi = async (page_path = "") => {
  const res: any = await bindPermissionConf({
    type: type.value,
    filter_type: filter_type.value,
    role_id: form.value.role_id,
    org_id: form.value.org_id,
    page_path: page_path,
    page_key: page_key.value,
    page_name: page_query.value,
    operate_name: operate_query.value
  });
  roles.value = res.data.roles;

  return res.data;
};
// 加载数据
const loadConfig = () => {
  getPageConfApi().then(res => {
    permission_mode.value = res.permission_mode;
    tree_data.value = res.menus;
    pageTableData.value = res.pages;
    buttonTableData.value = [];
    org_list.value = res.org_list;
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
  const selection = multipleTable.value.getSelectionRows();
  pageTableData.value.forEach(item => {
    if (selection.includes(item)) {
      item.status = page_select_type.value;
    }
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
  const selection = operateTable.value.getSelectionRows();
  buttonTableData.value.forEach(item => {
    if (selection.includes(item)) {
      item.status = operate_select_type.value;
    }
  });
};
const handleCopyToOrg = () => {
  copyToOrg.value.show();
};
const handleCopyToRole = () => {
  copyToRole.value.show();
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
  loadConfig();
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  height: 5px;
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #c9c9cf;
  border-radius: 6px;
}

.button-table {
  width: 100%;
  height: calc(100vh - 170px);
  color: rgba(30, 144, 255, 0.8);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  margin-left: 5px;
}
.filter-tree {
  background-color: #fff;
  margin-top: 10px;
  border-radius: 4px;
  padding-top: 8px;
}
.tree {
  height: calc(100vh - 210px);
  overflow-y: scroll;
}
</style>
