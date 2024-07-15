<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs
      :params="view_conf"
      @onSearch="onSearch"
      :defaultTab="tabName"
      :searchAuth="'OPERATE_ORGANIZATION_ADMINISTRATION_SEARCH'"
    />

    <splitpane :splitSet="settingLR">
      <template #paneL>
        <OrganizationTree
          :data="orgTreeData"
          :style="treeStyle"
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
              @click="showSyncDialog()"
              v-auth="'OPERATE_ORGANIZATION_ADMINISTRATION_SYNC'"
              >同步数据
            </el-button>
          </template>

          <template v-slot:column="{ row, item }">
            <el-tag
              v-if="item.value == 'status'"
              :type="row.status_value == 1 ? 'success' : 'warning'"
              >{{ row.status }}
            </el-tag>
          </template>
        </GetoTable>
      </template>
    </splitpane>

    <InfoDrawer ref="infoDrawerRef" title="详情" @onSearch="onSearch" />

    <SyncDialog
      ref="syncDialogRef"
      :task_func="syncList"
      class="MspHelper\User\Task\OrganizationAdministrationListSyncTask"
      @onSearch="onRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import InfoDrawer from "./components/InfoDrawer.vue";
import OrganizationTree from "./components/OrganizationTree.vue";
import SyncDialog from "../components/SyncDialog.vue";

import { emitter } from "@/utils/mitt";
import { useRouter } from "vue-router";
import splitpane, { ContextProps } from "@/components/ReSplitPane";

import {
  exportList,
  getListPageConf,
  syncList
} from "@/geto-components/GetoMspPage/api/userManage/organization-administration-list";

defineOptions({
  name: "organization_administration_list"
});

const router = useRouter();
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);

const getoTable = ref(null);
const infoDrawerRef = ref(null);
const syncDialogRef = ref(null);

const searchParams = ref({});
const isDisplayLowerLevel = ref(0);
const searchOrgParentId = ref(0);
const defaultSearchParam = ref({
  is_display_lower_level: isDisplayLowerLevel,
  pid: searchOrgParentId
});

const ids = ref([]);
const tabName = ref("");
const orgTreeData = ref({});
const expandedData = ref([]);

const init_data_config = {
  title: "行政组织列表",
  method: "POST",
  url: "/api/msp-helper/user/organization-administration/list",
  info_permission: "OPERATE_ORGANIZATION_ADMINISTRATION_INFO",
  export_func: exportList,
  export_permission: "OPERATE_ORGANIZATION_ADMINISTRATION_EXPORT",
  task_class: "OrganizationAdministrationListExcelExportTask",
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
  onSearch(null);
};

// 同步对话框
const showSyncDialog = () => {
  syncDialogRef.value.show();
};

// 获取列表页面配置
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;

  orgTreeData.value = res.data["org_tree"];
  if (res.data["org_tree"].length > 0) {
    expandedData.value.push(res.data["org_tree"][0]["id"]);
  }
};

// 搜索
const onSearch = val => {
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

// 接受点击高亮事件
const onHighLightClick = async row => {
  infoDrawerRef.value.show(row.id);
};

// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
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
