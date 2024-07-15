<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-20 14:33:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-11-24 14:35:28
 * @FilePath: src\views\page\base\countryList\index.vue
 * @Description: 计量单位-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" />
    <splitpane :splitSet="settingLR">
      <template #paneL>
        <div class="my-2">
          <el-input placeholder="模糊查询" v-model="filterText" clearable />
        </div>
        <!-- 自定义左侧面板的内容 -->
        <el-tree
          ref="treeRef"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          highlight-current
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </template>
      <template #paneR>
        <!-- 自定义右侧面板的内容 -->
        <GetoTable
          ref="getoTable"
          :config="table_conf"
          :page="page_conf"
          :initDataConfig="init_data_config"
          @onHighLightClick="onHighLightClick"
          @selectionChange="selectionChange"
        >
          <template v-slot:button-row>
            <el-button @click="handleSync">同步</el-button>
            <!-- <el-button @click="handleSyncGroup">同步单位分组</el-button> -->
          </template>
          <template v-slot:column="{ row, item }">
            <span v-if="item.value == 'code'">
              <span>{{ row.code }}</span>
            </span>
            <span v-if="item.value == 'status_name'">
              <el-tag
                v-if="item.value == 'status_name'"
                :type="row.status_name == '启用' ? 'success' : 'warning'"
                >{{ row.status_name }}</el-tag
              >
            </span>
          </template>
        </GetoTable>
      </template>
    </splitpane>

    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="syncSerach"
    />
  </div>
</template>

<script lang="ts" setup>
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { ref, reactive, onMounted, watch } from "vue";
import splitpane, { ContextProps } from "@/components/ReSplitPane";
import {
  getListPageConf,
  exportList,
  sync
} from "@/geto-components/GetoMspPage/api/base/measureUnitList";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "measuring_unit"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "计量单位",
  url: "/api/msp-helper/publicbasicdata/measure-unit/index",
  method: "POST",
  task_class: "MeasureUnitExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_MEASURE_UNIT_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams: any = ref({});
const getoTable = ref(null);
const ids = ref([]);
const detaildDrawer = ref(null);
const storeRoleDrawer = ref(null);

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const defaultProps = ref({
  children: "children",
  label: "name"
});
//
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;
  treeData.value = res.data.group_list;
};
const getoSyncDataDailog = ref(null);
const sync_task_config = {
  task_class: "PublicBasicDataSyncTask",
  sync_func: sync
};
const handleSync = () => {
  getoSyncDataDailog.value.show();
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 搜索
const onSearch = val => {
  // 接收搜索组件参数
  searchParams.value = val;
  // 传递查询参数进表格
  getoTable.value.onClickSearch(searchParams);
};
// 接受点击高亮事件
const onHighLightClick = row => {
  storeRoleDrawer.value.show(row.id);
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => item.id);
};
// 点击当前树节点回调
const handleNodeClick = (data: any) => {
  // console.log("Data", data);
  // 新增默认赋值
  detaildDrawer.value.measureUnitGroupId = data.id == 0 ? "" : data.id;
  if (!data.label || data.label == "全部") {
    searchParams.value.query.forEach((item, index) => {
      if (item.column == "measure_unit_group_name") {
        searchParams.value.query.splice(index, 1);
      }
    });
    getoTable.value.onClickSearch(searchParams);
    return;
  }
  // return;
  if (searchParams.value.query && searchParams.value.query.length > 0) {
    const isHasCategoryName: any = [];
    searchParams.value.query.forEach(item => {
      if (item.column == "measure_unit_group_name") {
        item.query = data.label;
      } else {
        isHasCategoryName.push(1);
      }
    });
    if (isHasCategoryName.length == searchParams.value.query.length) {
      searchParams.value.query.push({
        border_left: "",
        border_right: "",
        column: "measure_unit_group_name",
        joint: "and",
        operator: "like",
        query: data.label
      });
    }
  } else {
    searchParams.value.query = [
      {
        border_left: "",
        border_right: "",
        column: "measure_unit_group_name",
        joint: "and",
        operator: "like",
        query: data.label
      }
    ];
  }
  getoTable.value.onClickSearch(searchParams);
};
// 筛选树节点
const filterNode = (value, data) => {
  // console.log(value, data);
  if (!value) return true;
  return data.label.includes(value);
};
const syncSerach = () => {
  onSearch(searchParams.value);
  getListPageConfAPI();
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});
// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", () => {
    getListPageConfAPI();
  });
});

const settingLR: ContextProps = reactive({
  minPercent: 10,
  defaultPercent: 20,
  split: "vertical"
});
</script>

<style scoped lang="scss">
.filter-tree {
  width: 100%;
  color: rgba($color: dodgerblue, $alpha: 80%);
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  height: 460px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
