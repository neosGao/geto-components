<!--
 * @Author: 张永威 zyw@geto.com.cn
 * @Date: 2023-11-6 14:33:28
 * @LastEditors: 张永威 zyw@geto.com.cn
 * @LastEditTime: 2023-11-29 14:35:28
 * @FilePath: src\geto-components\GetoMspPage\views\base\area\countryList\index.vue
 * @Description: 国家区域管理-列表
 *
 * Copyright (c) zyw, All Rights Reserved.
-->

<template>
  <div class="dark:text-white geto-search-table">
    <div class="geto-tabs">
      <el-form :model="params" label-width="80px" label-position="right">
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="二级地址">
              <el-input v-model="params.name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地区分类">
              <el-select v-model="params.region_type" clearable>
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in conf.region_type_conf"
                  :key="index"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-row justify="space-around">
                <el-col :span="12">
                  <el-button type="primary" @click="handleSearch"
                    >查询</el-button
                  >
                </el-col>
                <el-col :span="10">
                  <el-button @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="geto-table mt-2">
      <div class="table-title">
        <p>国家管理</p>
      </div>
      <div class="table-btn">
        <el-button @click="handleSync">同步</el-button>
      </div>
      <el-table
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :data="tableData"
        v-loading="loading"
      >
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="suffix_code" label="国家后缀" />
        <el-table-column align="center" prop="area_code" label="国际区号" />
        <el-table-column
          align="center"
          prop="region_type_name"
          label="地区分类"
        />
      </el-table>
    </div>
    <GetoSyncDataDailog
      ref="getoSyncDataDailog"
      :syncTaskConfig="sync_task_config"
      @onCancelClick="handleSearch"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import GetoSyncDataDailog from "@/geto-components/GetoSyncDataDailog/index.vue";

import {
  getListPageConf,
  getList,
  sync
} from "@/geto-components/GetoMspPage/api/base/countryList";

defineOptions({
  name: "country"
});
// ------------------------------------------------------- 常量 -------------------------------------------------------
const loading = ref(false);
const params = ref({
  name: "",
  region_type: ""
});
const tableData = ref([]);
const conf: any = ref({});
// ------------------------------------------------------- 方法 -------------------------------------------------------
// 同步
const getoSyncDataDailog = ref(null);
const sync_task_config = {
  task_class: "PublicBasicDataSyncTask",
  sync_func: sync
};
const handleSync = () => {
  getoSyncDataDailog.value.show();
};
// 挂载
onMounted(() => {
  getListPageConf().then((res: any) => {
    conf.value.region_type_conf = res.data.region_type_conf;
  });
  getTableData();
});

const handleSearch = () => {
  getTableData();
};
// 获取表格数据
const getTableData = () => {
  loading.value = true;
  getList(params.value)
    .then((res: any) => {
      tableData.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 重置
const reset = () => {
  params.value.name = "";
  params.value.region_type = "";
};
</script>
<style scoped>
:deep(.el-tabs__content) {
  overflow: unset;
}
.geto-tabs {
  padding: 15px 10px 0px 10px;
  background-color: #fff;
  position: relative;
  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}
.geto-table {
  margin-top: 10px;
  background-color: #fff;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  flex: 1;
  height: 500px;
  .table-title {
    float: left;
    margin-top: 5px;
  }

  .table-btn {
    float: right;
    margin-bottom: 10px;
  }

  .table-pagination {
    float: right;
    margin-top: 5px;
  }

  .refreshIcon {
    position: relative;
    font-size: 20px;
    cursor: pointer;
    color: #929292;
    transition: transform 0.5s;
    &:hover {
      transform: rotate(180deg);
      color: rgb(59 130 246);
    }
  }
  .menuIcon {
    position: relative;
    font-size: 20px;
    cursor: pointer;
    color: #929292;
    &:hover {
      color: rgb(59 130 246);
    }
  }
  .table-header {
    background-color: rgb(250, 250, 250) !important;
    color: #000000;
  }
}
</style>
