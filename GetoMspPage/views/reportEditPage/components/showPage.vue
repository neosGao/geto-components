<!--
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-14 14:43:55
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-12-08 11:33:17
 * @FilePath: \sys-web\src\geto-components\GetoMspPage\views\reportEditPage\components\showPage.vue
 * @Description: 
 * 
 * Copyright (c) gwj, All Rights Reserved. 
-->
<template>
  <div class="flex-1 bg-white h-full w-[0px]">
    <div class="geto-search-table">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template v-slot:title>
            <span class="font-bold text-xl">{{
              activeNames.includes("1") ? "查询条件" : "展开查询条件"
            }}</span>
          </template>
          <!-- :config="{}" -->
          <GetoSearch
            ref="getoSearch"
            viewName="条件"
            @onSearch="() => {}"
            :diySearchConfig="{}"
            :justInput="true"
            :config="searchConfig"
            :key="searchIndex"
          />
          <div>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-scrollbar>
        <el-tabs type="border-card">
          <el-tab-pane label="图表">
            <lineChart ref="chartsPage" :id="props.id" />
          </el-tab-pane>
          <el-tab-pane label="报表详情">
            <GetoTable
              ref="getoTable"
              :config="table_conf"
              :page="page_conf"
              :initDataConfig="init_data_config"
              @onHighLightClick="onHighLightClick"
              @selectionChange="selectionChange"
              class="h-full"
            >
              <template v-slot:button-row>
                <el-button
                  @click="exportExcel"
                  v-auth="'OPERATE_STATEMENT_LIST_EXPORT'"
                  class="mr-2"
                  >导出</el-button
                >
                <el-dropdown
                  trigger="click"
                  :hide-on-click="false"
                  @visible-change="visibleChange"
                >
                  <el-button
                    @click="newIndex"
                    v-auth="'OPERATE_ASSESSMENT_SCHEME_STORE'"
                    >列配置</el-button
                  >
                  <template #dropdown>
                    <el-dropdown-menu class="translation">
                      <el-dropdown-item
                        v-for="(item, index) in table_conf"
                        :key="index"
                      >
                        <el-checkbox
                          v-model="item.display"
                          :label="item.label"
                        />
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </GetoTable>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import GetoSearch from "@/geto-components/GetoSearch/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import {
  exportList,
  getStatementInfo,
  setColumn,
  staticsExport
} from "../statementListApi";
import { useRouter } from "vue-router";
import lineChart from "./lineChart.vue";
import { message, closeAllMessage } from "@/utils/message";
defineOptions({
  name: "statement_show_page"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const props = defineProps({
  id: {
    type: Number,
    default: () => 0
  }
});
interface res {
  code?: string;
  data?: any;
  message?: string;
}
const router = useRouter();
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "报表管理列表",
  url: "/api/msp-helper/statement/statics-data/detail-list",
  method: "POST",
  export_func: exportList,
  export_permission: "OPERATE_ASSESSMENT_SCHEME_EXPORT",
  info_permission: "OPERATE_ASSESSMENT_SCHEME_INFO",
  useExport: false,
  useSelection: true,
  useIndex: true,
  searchParams: {
    id: props.id
  }
};
const getoTable = ref(null);
const ids = ref([]);
const activeNames = ref([]);
const id_ref = ref(0);
const getoSearch = ref(null);
const chartsPage = ref(null);
const searchIndex = ref(0);
const searchConfig = ref<any>({});
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  id_ref.value = props.id;
  const res: res = await getStatementInfo({ id: id_ref.value });
  if (res.code != "0") return;
  table_conf.value = res.data.list_column_conf;
  searchConfig.value = res.data.config_options.search;
  searchIndex.value += 1;
};
// ------------------------------------------------------- 事件 --------------------------------------------------------
// 新增方法
const env = import.meta.env;
const newIndex = item => {
  console.log("😅 ~ file: showPage.vue:150 ~ newIndex ~ item:", item);
  // getStatementInfo
};
// 接受点击高亮事件
const onHighLightClick = async row => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: "assessment_scheme_form",
      query: {
        type: "view",
        id: row.id
      }
    });
    return;
  }
};
// 接收传入打钩了的数据
const selectionChange = selection => {
  ids.value = selection.map(item => {
    const params = {
      id: item.id
    };
    return params;
  });
};
const onSearch = () => {
  chartsPage.value.initChart(getoSearch.value.exportSearchData());
  getoTable.value.onClickSearch({
    value: { condition: getoSearch.value.exportSearchData(), id: props.id }
  });
};
const reset = () => {
  getoSearch.value.reset();
};
const visibleChange = async flag => {
  if (!flag) {
    const res: res = await setColumn({
      id: props.id,
      list_column_conf: table_conf.value
    });
    if (res.code !== "0") return;
    message("列配置设置成功！", { type: "success" });
  }
};
const exportExcel = () => {
  message("正在导出...", {
    type: "warning",
    duration: 0
  });
  staticsExport({
    condition: getoSearch.value.exportSearchData(),
    id: props.id
  }).then((res: res) => {
    if (res.code !== "0") return;
    const a = document.createElement("a");
    a.href = res.data.download;
    a.click();
    closeAllMessage();
    message("导出成功!", { type: "success" });
  });
};
watch(props, val => {
  if (id_ref.value != val.id) {
    getListPageConfAPI();
    getoTable.value.onClickSearch({
      value: { id: props.id }
    });
  }
});
// 挂载
onMounted(async () => {
  if (!props.id) return;
  getListPageConfAPI();
});
</script>

<style scoped>
:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}
</style>
