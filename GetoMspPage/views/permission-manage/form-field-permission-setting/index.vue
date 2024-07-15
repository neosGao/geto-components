<template>
  <div class="dark:text-white geto-step-form">
    <el-alert
      title="该系统权限模式为单体系统，不支持表单字段功能！"
      type="warning"
      show-icon
      v-if="permission_mode != 'ORG'"
    />
    <GetoBackBar title="表单字段权限配置" routeName="role_list">
      <template #title>
        <span class="text-sm ml-5" style="color: #f56c6c"> 业务组织： </span>
        <el-select
          v-model="form.org_id"
          filterable
          clearable
          placeholder="请选业务组织"
          @change="loadConfig(false)"
        >
          <el-option
            v-for="item in org_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-radio-group v-model="form.type" class="ml-5" @change="loadConfig(true)">
          <el-radio :label="1">页面字段权限</el-radio>
          <el-radio :label="2">列表字段权限</el-radio>
        </el-radio-group>
      </template>
      <template #extra>
        <el-button
          type="primary"
          @click="handleCopyToOrg"
          v-if="permission_mode == 'ORG'"
          v-auth="'OPERATE_PERMISSION_FORM_FIELD_PERMISSION_COPY_TO_ORG'"
          >应用当前配置到其他组织</el-button
        >
        <el-button
          type="primary"
          @click="submitForm"
          v-if="permission_mode == 'ORG'"
          v-auth="'OPERATE_PERMISSION_FORM_FIELD_PERMISSION_SUBMIT'"
          >提交</el-button
        >
      </template>
    </GetoBackBar>
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="filter-tree">
          <GetoTree
            class="tree"
            :data="tree_data"
            :config="tree_config"
            @handleNodeClick="handleNodeClick"
          />
        </div>
      </template>
      <template #paneR>
        <!-- 自定义右侧面板的内容 -->
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
                <el-option label="不限" :value="1" />
                <el-option label="隐藏" :value="2" />
                <el-option label="只读" :value="3" />
                <el-option label="必填" :value="4" />
              </el-select>
            </template>
          </el-input>
          <el-table
            :data="pageTableData"
            border
            height="670"
            empty-text="请点击左侧选择路径获取字段数据"
            style="width: 100%"
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
            <el-table-column prop="name" label="字段名称" align="center" width="300" />
            <el-table-column
              prop="group_label"
              label="所属分组"
              width="200"
              align="center"
              v-if="form.type == 1"
            />
            <el-table-column
              prop="key"
              label="key"
              width="200"
              align="center"
              v-if="form.type == 2"
            />
            <el-table-column prop="hasAuth" label="权限" align="center">
              <template v-slot="scope">
                <el-radio-group v-model="scope.row.status" class="ml-4">
                  <el-radio
                    v-for="(s_item, s_index) in scope.row.status_options"
                    :key="s_index"
                    :label="s_item.value"
                    >{{ s_item.label }}</el-radio
                  >
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </splitpane>
    <div />
    <CopyToOrg ref="copyToOrg" :org_list="org_list" :org_id="form.org_id" :type="form.type" />
  </div>
</template>

<script setup lang="ts">
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import GetoTree from "@/geto-components/GetoTree/index.vue";
import { ref, onMounted, reactive } from "vue";
import {
  formFiledPermissionConf,
  formFiledPermission
} from "@/geto-components/GetoMspPage/api/form-field-permission";
import { Search } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import CopyToOrg from "./components/CopyToOrg.vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";

defineOptions({
  name: "form_field_permission_setting"
});

const permission_mode = ref("ORG");
const settingLR: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 15,
  split: "vertical"
});
const copyToOrg = ref(null);

const org_list = ref([]);
const tree_data = ref([]);
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
const operate_select_type = ref(0);
const buttonTableData = ref([]);

const form = ref({
  org_id: "",
  key: "",
  fields: [],
  type: 1
});
// 获取列表页面配置API
const getPageConfApi = async () => {
  const res: any = await formFiledPermissionConf({
    type: form.value.type,
    org_id: form.value.org_id,
    key: form.value.key,
    field_name:page_query.value,
  });

  return res.data;
};
const loadConfig = (reset_key = false) => {
  if (reset_key) {
    form.value.key = "";
  }
  getPageConfApi().then(res => {
    tree_data.value = res.tree;
    pageTableData.value = res.fields;
    buttonTableData.value = [];
  });
};
// 路径节点选中
const handleNodeClick = data => {
  if (form.value.type == 1 && data.page_key == "") {
    return;
  }
  form.value.key = data.key;
  getPageConfApi().then(res => {
    pageTableData.value = res.fields;
    buttonTableData.value = [];
  });
  page_select_type.value = 0;
};
// 页面表格单选
const singleElection = row => {
  templateSelection.value = row.id;
  checkList.value = pageTableData.value.filter(item => item.id === row.id);
  operate_select_type.value = 0;
  // handleClickPage(row);
};
// 页面数据点击
const handleClickPage = row => {
  page_key.value = "";
  page_key.value = row.key;
  buttonTableData.value = [];
  getPageConfApi().then(res => {
    buttonTableData.value = res.operates;
  });
};
// 页面搜索
const handleFilterPages = () => {
  getPageConfApi().then(res => {
    pageTableData.value = res.fields;
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
const handleCopyToOrg = () => {
  copyToOrg.value.show();
};
// 提交
const submitForm = async () => {
  form.value.fields = pageTableData.value.map(item => {
    return {
      name: item.name,
      key: item.key,
      status: item.status,
      group_key: item.group_key
    };
  });
  formFiledPermission(form.value).then(res => {
    const data: any = res.data;
    message(data.msg, { type: "success" });
  });
};
// 挂载
onMounted(() => {
  getPageConfApi().then(res => {
    permission_mode.value = res.permission_mode;
    tree_data.value = res.tree;
    org_list.value = res.org_list;
    pageTableData.value = res.fields;
    buttonTableData.value = [];
  });
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
  margin: 10px 5px;
}
.filter-tree {
  background-color: #fff;
  margin-top: 10px;
  border-radius: 4px;
}
.tree {
  height: calc(100vh - 170px);
  overflow-y: scroll;
}
</style>
