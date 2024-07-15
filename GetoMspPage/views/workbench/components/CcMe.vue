<template>
  <GetoWorkbenchcCard
    :title="title"
    v-loading="loading"
    @onRefresh="loadData"
    :h="config.h"
  >
    <template v-slot:card_header_btn>
      <el-link :underline="false" class="mr-2" type="primary" @click="goToList">
        查看全部（{{ total }}）</el-link
      >
    </template>
    <template v-slot:card_body>
      <div v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="body" @click="goToDetail(item)">
            <div class="content">
              <span>【{{ item.app_name }}】</span>
              <span>{{ item.submit_user_name }}提交的 </span>
              <span> {{ item.category_name }} 申请单</span>
              <span>抄送给你</span>
            </div>
            <div class="time">
              <span>{{ item.reach_time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无数据" />
      </div>
    </template>
  </GetoWorkbenchcCard>
</template>

<script setup lang="ts">
import GetoWorkbenchcCard from "@/geto-components/GetoWorkbenchCard/index.vue";
import { defineOptions, defineProps, ref, onMounted } from "vue";
import { getComponentData } from "@/geto-components/GetoMspPage/api/workbench";
import { usePage } from "@/geto-components/GetoUtils/page";

defineOptions({
  name: "CcMe"
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

const page = usePage();
const loading = ref(false);
const list = ref([]);
const total = ref(0);

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "CcMe"
  })
    .then((res: any) => {
      list.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const goToDetail = (item: any) => {
  page.addPageByAudit("抄送详情", {
    path: "/audit/detail",
    param: JSON.stringify({
      auditType: "copy",
      id: item.id
    })
  });
};

const goToList = () => {
  page.addPageByAudit("抄送列表", {
    path: "/application/reciption_list"
  });
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 10px;
  font-size: 14px;
  .body {
    padding-bottom: 20px;
    .content {
      // 超出宽度显示省略号
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 隐藏超出容器的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
      width: calc(100% - 120px);
      float: left;
    }
    .time {
      float: right;
      color: #999;
      font-size: 12px;
      margin-top: 2px;
      width: 120px;
      text-align: right;
    }
    .time:hover {
      color: #409eff;
    }
  }
}
.item:hover {
  color: #409eff;
  cursor: pointer;
}
</style>
