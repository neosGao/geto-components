<template>
  <GetoWorkbenchcCard
    :title="title"
    v-loading="loading"
    @onRefresh="loadData"
    :h="config.h"
  >
    <template v-slot:card_body>
      <div class="body">
        <el-row :gutter="15">
          <el-col :span="6">
            <div class="item">
              <el-statistic :value="list['be_submit']" class="info" />
              <p class="content">待提交</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <el-statistic :value="list['auditing']" class="bule" />
              <p class="content">审核中</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <el-statistic :value="list['un_audit']" class="red" />
              <p class="content">未通过</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item red">
              <el-statistic :value="list['pass']" class="bule-light" />
              <p class="content">已通过</p>
            </div>
          </el-col>
        </el-row>
        <div class="footer">
          <p>更新时间：{{ update_time }}</p>
        </div>
      </div>
    </template>
  </GetoWorkbenchcCard>
</template>

<script setup lang="ts">
import GetoWorkbenchcCard from "@/geto-components/GetoWorkbenchCard/index.vue";
import { defineOptions, defineProps, ref, onMounted } from "vue";
import { getComponentData } from "@/geto-components/GetoMspPage/api/workbench";

defineOptions({
  name: "MyFlow"
});
defineProps({
  title: {
    type: String,
    default: ""
  },
  config: {
    type: Object,
    default: () => ({})
  }
});

const loading = ref(false);
const list = ref({});
const update_time = ref("");

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "MyFlow"
  })
    .then((res: any) => {
      list.value = res.data.data;
      update_time.value = res.data.time;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.el-statistic {
  --el-statistic-content-font-size: 30px;
  // 加粗
  --el-statistic-content-font-weight: 550;
}
.info {
  --el-statistic-content-color: #909399;
}
.red {
  --el-statistic-content-color: #f56c6c;
}
.bule {
  --el-statistic-content-color: #337ecc;
}
.bule-light {
  --el-statistic-content-color: #409eff;
}
.body {
  padding: 20px;
  .item {
    text-align: center;
    .content {
      margin-top: 20px;
    }
  }
  .footer {
    color: #909399;
    font-size: 12px;
    margin-top: 50px;
    text-align: center;
  }
}
</style>
