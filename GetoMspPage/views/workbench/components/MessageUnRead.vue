<template>
  <GetoWorkbenchcCard
    :title="title"
    v-loading="loading"
    @onRefresh="loadData"
    :h="config.h"
  >
    <template v-slot:card_header_btn>
      <el-link
        :underline="false"
        class="mr-2"
        type="primary"
        @click="viewDetail(null)"
      >
        查看全部（{{ total }}）</el-link
      >
    </template>
    <template v-slot:card_body>
      <div v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="body" @click="viewDetail(item.id)">
            <div class="content">
              <span>【消息中心】</span>
              <span>{{ item.title }}</span>
              <span>{{ filterHtml(item.content) }}</span>
            </div>
            <div class="time">
              <span>{{ item.create_time }}</span>
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
import { useRouter } from "vue-router";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "MessageUnRead"
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
const list = ref([]);
const total = ref(0);
const router = useRouter();

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "MessageUnRead"
  })
    .then((res: any) => {
      list.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const viewDetail = id => {
  openPage(id);
};
const filterHtml = data => {
  // data = data.replace(/<img.*\/>/gi, "");
  // data = data.replace(/<(.+?)>/gi, "");
  data = data.replace(/<(.+?)>/gi, "");
  return data;
};

const env = import.meta.env;
const openPage = (Id?: string) => {
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: "management_message_list",
      query: {
        id: Id
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == "management_message_list");
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  let url = "";
  if (Id) {
    url = host + route.path + "?id=" + Id;
  } else {
    url = host + route.path;
  }
  const params = [
    {
      name: title,
      path: url,
      url: url
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};
onMounted(() => {
  loadData();
  emitter.on("changePushStatus", () => {
    loadData();
  });
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
