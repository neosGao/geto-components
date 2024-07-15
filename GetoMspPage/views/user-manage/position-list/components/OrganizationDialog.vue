<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择上级业务组织"
    width="70%"
    :close-on-click-modal="false"
  >
    <div style="height: 500px">
      <splitpane :splitSet="settingLR">
        <template #paneL>
          <OrganizationTree
            ref="organizationTree"
            :config="treeConfig"
            :data="orgTreeData"
            :selectDisable="true"
            :businessTypeList="businessTypeListData"
            :businessTypeSelected="businessTypeId"
            @handleBusinessTypeChange="handleBusinessTypeSearch"
            @handleDisplayLowerLevelChange="handleDisplayLowerLevelSearch"
            @handleNodeClick="handleNodeClickSearch"
            v-if="isInitdata"
          />
        </template>
        <template #paneR>
          <GetoTable
            ref="getoTable"
            :config="table_conf"
            :page="page_conf"
            :initDataConfig="init_data_config"
            @handleRowClick="handleRadioCheck"
            v-if="isInitdata"
          >
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
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits } from "vue";
import { emitter } from "@/utils/mitt";
import OrganizationTree from "./OrganizationTree.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import { getOrgListPageConf } from "@/geto-components/GetoMspPage/api/userManage/position-list";
// import {
//   getList,
//   getListPageConf
// } from "@/api/organization/business-manage-api";
import { message } from "@/utils/message";
import { nextTick } from "process";

const searchParams = ref({});
const isDisplayLowerLevel = ref(0);
const searchOrgParentId = ref(0);
const businessTypeId = ref(0);
const businessTypeListData = ref([]);
const defaultSearchParam = ref({
  is_display_lower_level: isDisplayLowerLevel,
  pid: searchOrgParentId,
  business_type_id: businessTypeId,
  status: 1
});
const dialogVisible = ref(false);
const isInitdata = ref(false);

const settingLR: ContextProps = reactive({
  minPercent: 17,
  defaultPercent: 17,
  split: "vertical"
});

const treeConfig = {
  showCheckbox: false,
  treePropsLabel: "name",
  expandAll: true
};

const table_conf = ref([]);
const page_conf = ref([]);
const getoTable = ref(null);
const organizationTree = ref(null);

const init_data_config = {
  title: "组织",
  method: "POST",
  url: "/api/msp-helper/user/position/get-org-list",
  searchParams: defaultSearchParam,
  useSelection: false,
  usePrependOperate: true,
  useIndex: true,
  useRadio: true
};

const selectInfo = ref({});

const emits = defineEmits(["handlerConfirmInfo"]); // 定义发射给父组件的事件
const orgTreeData = ref([]);
const show = async business_type_id => {
  isInitdata.value = false;
  const res: any = await getOrgListPageConf();
  if (res.code != "0") {
    message("获取组织树失败", { type: "warning" });
    return;
  }
  orgTreeData.value = res.data["org_tree"];
  const view_conf = res.data["page_conf"]["view_conf"];
  const default_view = view_conf[0];

  const custom_column_names = ["code", "name", "type"];
  const default_column = default_view.conf.list_columns;
  const list_columns = [];
  for (let i = 0; i < default_column.length; i++) {
    if (custom_column_names.includes(default_column[i].value)) {
      list_columns.push(default_column[i]);
    }
  }

  businessTypeListData.value = res.data["business_type"];
  businessTypeId.value = business_type_id;

  init_data_config.searchParams.business_type_id = business_type_id;

  table_conf.value = default_column;

  dialogVisible.value = true;

  reset(isfirst);

  isInitdata.value = true;
  isfirst.value = false;
};
const isfirst = ref(true);

const handleBusinessTypeSearch = async businessTypeSelected => {
  businessTypeId.value = businessTypeSelected;
  onSearch(null);
};

const handleDisplayLowerLevelSearch = async isDisplay => {
  isDisplayLowerLevel.value = isDisplay;
  onSearch(null);
};

const handleNodeClickSearch = async data => {
  searchOrgParentId.value = data.id;
  onSearch(null);
};

const onSearch = val => {
  searchParams.value = Object.assign(
    searchParams.value,
    defaultSearchParam.value
  );
  getoTable.value.onClickSearch(searchParams);
};

const handleRadioCheck = (row, column, event) => {
  selectInfo.value = {
    id: row.id,
    name: row.name
  };
};

const handleConfirm = () => {
  if (selectInfo.value == null) {
    message("请选择上级组织！", { type: "warning" });
    return;
  }
  emits("handlerConfirmInfo", selectInfo.value);
  dialogVisible.value = false;
};

const reset = async first => {
  searchParams.value = {};
  isDisplayLowerLevel.value = 0;
  searchOrgParentId.value = 0;

  nextTick(() => {
    organizationTree.value.resetTree();
  });
  if (!first.value) {
    onSearch(null);
  }
};

defineExpose({
  show
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
