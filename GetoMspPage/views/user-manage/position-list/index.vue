<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_POSITION_SEARCH'"
    />

    <splitpane :splitSet="settingLR">
      <template #paneL>
        <OrganizationTree
          :data="orgTreeData"
          :style="treeStyle"
          :businessTypeName="businessTypeName"
          :expandedData="expandedData"
          :config="treeConfig"
          @handleDisplayLowerLevelChange="handleDisplayLowerLevelSearch"
          @handleNodeClick="handleNodeClickSearch"
        />
      </template>

      <template #paneR>
        <GetoTable
          ref="getoTable"
          :config="table_conf"
          :page="page_conf"
          :initDataConfig="init_data_config"
          @onHighLightClick="onHighLightClick"
          @selectionChange="selectionChange"
        >
          <template v-slot:button-row>
            <el-button
              class="ml-1"
              plain
              @click="handleOperate('bind')"
              v-auth="'OPERATE_POSITION_BIND_USER'"
              >绑定用户
            </el-button>
            <el-button
              class="ml-1"
              plain
              @click="handleOperate('add')"
              v-auth="'OPERATE_POSITION_STORE'"
              >新增
            </el-button>

            <el-button
              class="ml-1"
              plain
              @click="handleOperate('del')"
              v-auth="'OPERATE_POSITION_REMOVE'"
              >删除
            </el-button>

            <el-dropdown
              split-button
              @click="checkUnableOrenable()"
              @command="handleCommand"
              v-auth="'OPERATE_POSITION_ENABLE_OR_DISABLE'"
              class="ml-1"
            >
              禁用
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="enable">启用</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-button
              class="ml-1"
              plain
              @click="handleOperate('import')"
              v-auth="'OPERATE_POSITION_IMPORT'"
              >导入
            </el-button>
          </template>
          <template v-slot:column="{ row, item }">
            <el-button
              v-if="item.value == 'code'"
              type="primary"
              link
              @click="tableHighlight(row, item)"
              >{{ row.code }}</el-button
            >

            <el-tag
              v-if="item.value == 'status'"
              :type="row.status_value == 1 ? 'success' : 'warning'"
              >{{ row.status }}
            </el-tag>

            <el-button
              v-if="item.value == 'related_user_num'"
              type="primary"
              link
              @click="tableHighlight(row, item)"
              >{{ row.related_user_num }}</el-button
            >
          </template>
        </GetoTable>
      </template>
    </splitpane>

    <InfoDrawer ref="infoDrawerRef" title="详情" @onSearch="onSearch" />

    <StoreOrganizationDrawer
      ref="storeOrganizationDrawer"
      :typeListData="typeListData"
      :businessTypeId="businessTypeId"
      @onSearch="onSearch"
      @updateOrgTree="updateOrgTree"
    />
    <BindUsersDrawer
      ref="bindUsersDrawer"
      :job_type_option="job_type_option"
      @onSearch="onSearch"
    />
    <MemberDetailsDrawer ref="memberDetailsDrawer" @onSearch="onSearch" />

    <GetoImportDialog
      ref="GetoImportDialogList"
      template="岗位列表导入模板.xlsx"
      class="PositionListExcelImportTask"
      :import_func="importList"
      @onSearch="onRefresh"
    />

    <el-dialog
      v-model="dialogVisible"
      width="30%"
      title="提示"
      draggable
      ref="statusDialog"
    >
      <span>{{ statusDialog.tip }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmHandlerStatus">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import OrganizationTree from "./components/OrganizationTree.vue";
import GetoImportDialog from "@/geto-components/GetoImportDialog/index.vue";
import StoreOrganizationDrawer from "./components/StoreOrganizationDrawer.vue";
import BindUsersDrawer from "./components/BindUsersDrawer.vue";
import MemberDetailsDrawer from "./components/MemberDetailsDrawer.vue";

import { emitter } from "@/utils/mitt";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { type } from "../../../../../components/ReDialog/index";
import { nextTick } from "process";

import {
  getListPageConf,
  exportList,
  importList,
  remove,
  disable,
  enable
} from "@/geto-components/GetoMspPage/api/userManage/position-list";

defineOptions({
  name: "position_list"
});

const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);

const getoTable = ref(null);
const infoDrawerRef = ref(null);
const syncDialogRef = ref(null);
const GetoImportDialogList = ref(null);
const statusDialog = ref(null);
const dialogVisible = ref(false);

const job_type_option = ref([]);

const searchParams = ref({});
const isDisplayLowerLevel = ref(0);
const searchOrgParentId = ref(0);
const defaultSearchParam = ref({
  is_display_lower_level: isDisplayLowerLevel,
  pid: searchOrgParentId
});

const parentOrgObj = ref({})

const ids = ref([]);
const statuses = ref([]);
const selectionData = ref([]);
const tabName = ref("");
const orgTreeData = ref({});
const expandedData = ref([]);
const businessTypeName = ref("");

const init_data_config = {
  title: "岗位列表",
  method: "POST",
  url: "/api/msp-helper/user/position/list",
  info_permission: "OPERATE_POSITION_INFO",
  export_func: exportList,
  export_permission: "OPERATE_POSITION_EXPORT",
  task_class: "OrganizationBusinessListExcelExportTask",
  useExport: true,
  useSelection: true,
  useIndex: true
};

const settingLR: ContextProps = reactive({
  minPercent: 15,
  defaultPercent: 20,
  split: "vertical"
});

const treeConfig = {
  showCheckbox: false,
  treePropsLabel: "name"
};

const treeStyle = "height: 500px;overflow: auto;"

const handleDisplayLowerLevelSearch = async isDisplay => {
  isDisplayLowerLevel.value = isDisplay;
  onSearch(null);
};

const handleNodeClickSearch = async data => {
  searchOrgParentId.value = data.id;

  parentOrgObj.value = {
    organization_id: data.id,
    organization_name: data.name,
  }
  onSearch(null);
};
const bindUsersDrawer = ref();
const memberDetailsDrawer = ref();
const storeOrganizationDrawer = ref();
const typeListData = ref([]);
const businessTypeId = ref(0);
// 同步对话框
const handleOperate = type => {
  switch (type) {
    case "bind":
      if (selectionData.value.length !== 1) {
        message("请选择一条需要绑定的数据", { type: "warning" });
        return;
      }
      bindUsersDrawer.value.show(selectionData.value[0]);
      break;
    case "add":
      storeOrganizationDrawer.value.show(0, parentOrgObj.value);
      break;
    case "del":
      handleRemove();
      break;
    case "import":
      GetoImportDialogList.value.show();
      break;
  }
};
const updateOrgTree = () => {
  // getoTree.value.getOrgTreeData();
};
const tableHighlight = (row, item) => {
  switch (item.value) {
    case "code":
      storeOrganizationDrawer.value.show(row.id);
      break;
    case "related_user_num":
      memberDetailsDrawer.value.show(row.id);
      break;
  }
};

// 获取列表页面配置
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;

  orgTreeData.value = res.data["org_tree"];
  job_type_option.value = res.data["job_type"];
  if (res.data["org_tree"].length > 0) {
    expandedData.value.push(res.data["org_tree"][0]["id"]);
    parentOrgObj.value = {
      organization_id: orgTreeData.value[0]["id"],
      organization_name: orgTreeData.value[0]["name"],
    }
  }
  businessTypeName.value = res.data["business_type_name"];
};

// 搜索
const onSearch = val => {
  if (!searchParams.value) {
    searchParams.value = {};
  }
  // 接收搜索组件参数
  searchParams.value = Object.assign(
    searchParams.value,
    defaultSearchParam.value,
    val
  );
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};

const onRefresh = val => {
  getListPageConfAPI();
  onSearch(val);
};

const handleCommand = command => {
  if (command === "enable") {
    checkUnableOrenable(1);
  }
};

const checkUnableOrenable = async (status = 0) => {
  if (ids.value.length == 0) {
    message("请选择需要操作的数据", { type: "warning" });
    return;
  }
  let isDiff = false;
  let isSame = true;
  const compareValue = statuses.value[0];
  statuses.value.map(function (item) {
    if (compareValue != item) {
      isSame = false;
    }
    if (item == status) {
      isDiff = true;
    }
  });
  if (isSame == false) {
    if (status == 0) {
      message("所选组织禁用状态不一致，请重新选择！", { type: "warning" });
    } else {
      message("所选组织启用状态不一致，请重新选择！", { type: "warning" });
    }
    return;
  }
  if (isDiff == true) {
    if (status == 0) {
      message("所选组织状态已经是“禁用”状态，无需重复操作！", {
        type: "warning"
      });
    } else {
      message("所选组织状态已经是“启用”状态，无需重复操作！", {
        type: "warning"
      });
    }
    return;
  }
  dialogVisible.value = true;
  if (status == 0) {
    statusDialog.value.tip = "是否将选择的岗位状态变成禁用？";
  } else {
    statusDialog.value.tip = "是否将选择的岗位状态变成启用？";
  }
  statusDialog.value.status = status;
};

const confirmHandlerStatus = () => {
  handleUnableOrenable(statusDialog.value.status);
  dialogVisible.value = false;
};

const handleUnableOrenable = async (status = 0) => {
  let res = null;
  if (status) {
    res = await enable({ ids: ids.value });
  } else {
    res = await disable({ ids: ids.value });
  }
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

const handleRemove = async () => {
  if (ids.value.length == 0) {
    message("请选择需要操作的数据", { type: "warning" });
    return;
  }
  const res = await remove({ ids: ids.value });
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

// 接受点击高亮事件
const onHighLightClick = async row => {
  infoDrawerRef.value.show(row.id);
};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
  statuses.value = selection.map(item => item.status_value);
  selectionData.value = selection;
};

// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", () => {
    getListPageConfAPI();
  });
});
</script>

<style>
:deep(.splitter-pane .splitter-paneR .vertical) {
  display: flex;
}
</style>
