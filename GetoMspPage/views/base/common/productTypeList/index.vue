<!--
 * @Author: 廖勇 liaoyong@geto.com.cn
 * @Date: 2023-12-12 15:53:28
 * @LastEditors: 廖勇 liaoyong@geto.com.cn
 * @LastEditTime: 2023-12-12 15:53:28
 * @FilePath: src\views\page\base\productType\index.vue
 * @Description: 产品类型管理-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <GetoTabs :params="view_conf" @onSearch="onSearch" />
    <GetoTable
      ref="getoTable"
      :config="table_conf"
      :page="page_conf"
      :initDataConfig="init_data_config"
      @selectionChange="selectionChange"
    >
      <template v-slot:column="{ row, item }">
        <span
          v-if="item.value == 'allow_split' && row[item.value] === '是'"
          style="color: #fea443"
          >{{ row[item.value] }}
        </span>
        <span v-else>{{ row[item.value] }} </span>
      </template>
      <template v-slot:button-row>
        <el-button @click="handleSync">同步</el-button>
      </template>
    </GetoTable>
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import GetoTabs from "@/geto-components/GetoTabs/index.vue";
import GetoTable from "@/geto-components/GetoTable/index.vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";
import { ref, onMounted } from "vue";
import {
  getListPageConf,
  exportList,
  sync
} from "@/geto-components/GetoMspPage/api/base/productTypeList";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理

defineOptions({
  name: "common_product_type"
});

// ------------------------------------------------------- 常量 -------------------------------------------------------
const view_conf = ref([]);
const table_conf = ref([]);
const page_conf = ref([]);
const init_data_config = {
  title: "产品类型维护",
  url: "/api/msp-helper/publicbasicdata/product-type/index",
  method: "POST",
  task_class: "ProductTypeExcelExportTask",
  export_func: exportList,
  export_permission: "OPERATE_PRODUCT_TYPE_EXPORT",
  useSelection: true,
  useIndex: true
};
const searchParams = ref({});
const getoTable = ref(null);
const ids = ref([]);
// ------------------------------------------------------- 方法 -------------------------------------------------------
/**
 * 获取列表页面配置
 */
const getListPageConfAPI = async () => {
  const res: any = await getListPageConf();
  view_conf.value = res.data["page_conf"]["view_conf"];
  const default_view = view_conf.value[0];
  table_conf.value = default_view.conf.list_columns;
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

<style scoped>
.menu-1 {
  height: calc(100vh - 85px);
  padding: 10px;
}

.table-opt-btn {
  margin-right: 10px;
}
::v-deep(.pointer) {
  cursor: pointer;
  color: #409eff;
}
</style>
