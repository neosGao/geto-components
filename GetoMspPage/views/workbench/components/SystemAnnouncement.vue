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
        @click="handleRedirectToAll"
      >
        查看全部（{{ total }}）</el-link
      >
    </template>
    <template v-slot:card_body>
      <div v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="body">
            <div class="content">
              <span>【{{ item.is_read ? "已读" : "未读" }}】</span>
              <span @click="handleInfo(item)">{{ item.title }}</span>
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
      <el-dialog title="公告详情" v-model="dialog" width="50%" append-to-body>
        <div v-html="content" />
      </el-dialog>
      <el-dialog
        :key="popup_index"
        title="公告详情"
        v-model="popup_dialog"
        width="50%"
        append-to-body
        @close="handlePopupLoop"
      >
        <div v-html="popup_content" />
      </el-dialog>
    </template>
  </GetoWorkbenchcCard>
</template>

<script setup lang="ts">
import GetoWorkbenchcCard from "@/geto-components/GetoWorkbenchCard/index.vue";
import { defineOptions, defineProps, ref, onMounted } from "vue";
import {
  getComponentData,
  announcementRead
} from "@/geto-components/GetoMspPage/api/workbench";
import { useRouter } from "vue-router";

defineOptions({
  name: "SystemAnnouncement"
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

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "SystemAnnouncement"
  })
    .then((res: any) => {
      list.value = res.data.data;
      total.value = res.data.total;
      popup_arr.value = [];
      popup_content.value = "";
      popup_index.value = 0;
      list.value.forEach(item => {
        if (item.is_popup) {
          popup_arr.value.push(item);
        }
      });
    })
    .finally(() => {
      loading.value = false;
      handlePopupLoop();
    });
};

const router = useRouter();
const handleRedirectToAll = () => {
  router.push({
    name: "my_system_announcement"
  });
};

const dialog = ref(false);
const content = ref("");
const handleInfo = (row: any) => {
  content.value = "";
  dialog.value = true;
  content.value = row.content;
  announcementRead({
    id: row.id
  });
  row.is_read = true;
};

// 弹窗处理
const popup_index = ref(0);
const popup_arr: any = ref([]);
const popup_dialog = ref(false);
const popup_content = ref("");
const handlePopupLoop = () => {
  popup_dialog.value = false;
  popup_content.value = "";
  if (popup_arr.value.length == 0) {
    return;
  }
  if (popup_index.value >= popup_arr.value.length) {
    return;
  }
  handlePopup(popup_arr.value[popup_index.value]);
};
const handlePopup = (item: any) => {
  if (!item.is_popup) {
    return;
  }
  popup_dialog.value = true;
  popup_content.value = item.content;
  announcementRead({
    id: item.id
  }).then(() => {
    popup_index.value = popup_index.value + 1;
    item.is_popup = false;
    item.is_read = true;
  });
};

onMounted(() => {
  popup_index.value = 0;
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
