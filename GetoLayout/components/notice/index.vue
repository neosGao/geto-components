<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { noticesData, type TabItem } from "./data";
import NoticeList from "./noticeList.vue";
import Bell from "@iconify-icons/ep/bell";
import {
  unreadList,
  atestUnread,
  setPushStatus,
  getPushStatus,
  readAll
} from "@/geto-components/GetoApi/workbench";
import { emitter } from "@/utils/mitt";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
interface res {
  code?: string;
  data?: any;
  message?: string;
}
const noticeDropdown = ref(null);
const noticesNum = ref(0);
const notices = ref(noticesData);
const activeKey = ref(noticesData[0].key);

const router = useRouter();
const isDesktopPush = ref(false);
const timer = ref();
const lastId = ref();
const user_info = JSON.parse(sessionStorage["user-info"]);
// 桌面消息推送 状态改变回调
const changePushStatusValue = async value => {
  const res3: res = await setPushStatus({ status: value ? 1 : 0 });
  if (res3.code == "0") {
    isDesktopPush.value = value;
    controlNewMessage(value);
  }
  if (value) {
    getNewMessage();
  }
};
// 消息中心 标记全部为已读
const markRead = async () => {
  const res4: res = await readAll();
  if (res4.code == "0") {
    emitter.emit("changePushStatus");
  }
};
// 获取消息中心 数据
const getMessageCenterData = async () => {
  const res1: res = await unreadList();
  if (res1.code !== "0") return;
  const messageItem: TabItem = notices.value.find(item => item.key == "4");
  messageItem.list = res1.data.map(item => {
    item.extra = item.create_time;
    item.pageName = "management_message_list";
    return item;
  });
  noticesNum.value = 0;
  notices.value.map(v => (noticesNum.value += v.list.length));
};
// 获取桌面消息推送 状态
const getPushStatusValue = async () => {
  const res2: res = await getPushStatus();
  // 增加容错
  if (res2.code === "0") {
    isDesktopPush.value = res2?.data?.status == 1 ? true : false;
  } else {
    isDesktopPush.value = false;
  }
  controlNewMessage(isDesktopPush.value);
  if (isDesktopPush.value) {
    getNewMessage();
  }
};
// 获取最新一条未读消息 并通知
const getNewMessage = async () => {
  ElNotification.closeAll();
  const res5: res = await atestUnread({
    last_id: lastId.value ? lastId.value : 0
  });
  if (res5.data.id) {
    lastId.value = res5.data.id;
    const content = res5.data.content.replace(/<img.*\/>/i, "");
    ElNotification({
      title: `${user_info.username}，您好！`,
      dangerouslyUseHTMLString: true,
      duration: 0,
      position: "bottom-right",
      onClick: clickNotification,
      message: `
          <div style="height:150px">
            <div style="height:100px;overflow:hidden">
              ${content}
            </div>
            <span data-v="2344" style="color:#409EFF;cursor:pointer;">...更多</span>
            <div style="position:absolute;bottom:10px;left:20px">
              <span style="color:#909399;cursor:pointer;">不再提示</span>
            </div>
            <div style="position:absolute;bottom:10px;right:10px">
              <span style="color:#409EFF;cursor:pointer;">查看全部通知 ></span>
            </div>
          </div>`
    });
  }
};
const clickNotification = e => {
  if (e.target.innerText == "...更多") {
    openPage("management_message_list", lastId.value);
  } else if (e.target.innerText == "查看全部通知 >") {
    openPage("management_message_list");
  } else if (e.target.innerText == "不再提示") {
    changePushStatusValue(false);
  }
  ElNotification.closeAll();
};
// 是否开启 桌面消息推送
const controlNewMessage = value => {
  if (value) {
    timer.value = setInterval(async () => {
      getNewMessage();
    }, 5 * 60 * 1000);
  } else {
    clearInterval(timer.value);
    timer.value = undefined;
  }
};
const clickNotice = async noticeItem => {
  if (noticeItem.pageName) {
    openPage(noticeItem.pageName, noticeItem.id);
  }
};
const env = import.meta.env;
const openPage = (pageName: string, Id?: string) => {
  noticeDropdown.value.handleClose();
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    router.push({
      name: pageName,
      query: {
        id: Id
      }
    });
    return;
  }
  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == pageName);
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
onMounted(async () => {
  getMessageCenterData();
  getPushStatusValue();
  emitter.on("changePushStatus", () => {
    getMessageCenterData();
  });
});
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
notices.value.map(v => (noticesNum.value += v.list.length));
</script>

<template>
  <el-dropdown ref="noticeDropdown" trigger="click" placement="bottom-end">
    <span class="dropdown-badge navbar-bg-hover select-none">
      <el-badge :value="noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="Bell" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          :stretch="true"
          v-model="activeKey"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            description="暂无消息"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane
                :label="`${item.name}(${item.list.length})`"
                :name="`${item.key}`"
              >
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" @clickNotice="clickNotice" />
                  </div>
                </el-scrollbar>
                <div class="floor" v-if="item.key == 4">
                  <el-switch
                    v-model="isDesktopPush"
                    class="mb-2"
                    active-text="桌面消息推送"
                    @change="changePushStatusValue"
                  />
                  <el-button type="primary" @click="markRead" text
                    >全部标记为已读</el-button
                  >
                </div>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}

.floor {
  border-top: 1px solid rgb(228, 230, 224);
  padding: 5px 5px 0 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
</style>
