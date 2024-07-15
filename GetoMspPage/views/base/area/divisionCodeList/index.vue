<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-21 11:31:20
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-11-29 11:31:20
 * @FilePath: src\geto-components\GetoMspPage\views\base\area\divisionCodeList\index.vue
 * @Description: 地区简码维护-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" :defaultTab="tabName" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @onHighLightClick="onHighLightClick"
      @selectionChange="selectionChange"
    >
      <template v-slot:column="{ row, item }">
        <el-tag
          v-if="item.value == 'status_name'"
          :type="row.status_value == 1 ? 'success' : 'warning'"
          >{{ row.status_name }}</el-tag
        >
        <span v-if="item.value == 'short_code'">
          {{ row.short_code }}
        </span>
      </template>
    </GetoTable>
  </div>
</template>

<script lang="ts" setup>
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList
} from "@/geto-components/GetoMspPage/api/base/divisionCodeList";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "local_code_maintain"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "地区简码维护",
  url: "/api/msp-helper/publicbasicdata/division-code/index",
  method: "POST",
  task_class: "DivisionCodeExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_BASIC_DIVISION_CODE_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
const storeRoleDrawer = ref(null);
const tabName = ref("默认");
// ------------------------------------------------------- 方法 -------------------------------------------------------
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view: any = view_conf.value.filter(
    item => item.name === tabName.value
  )[0];
  table_conf.value = default_view.conf.list_columns;
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
// 挂载
onMounted(() => {
  getListPageConfAPI();
  // 接收事件
  emitter.on("showPageListSave", returnName => {
    tabName.value = returnName;
    getListPageConfAPI();
  });
});
</script>

<style scoped>
.menu-1 {
  height: calc(100vh - 85px);
  padding: 10px;
}

.table-opt-btn {
  margin-right: 10px;
}
</style>
