<template>
  <div class="dark:text-white geto-search-table" v-loading="loading">
    <div class="opt-bar">
      <div class="opt-bar-btn">
        <el-link :underline="false" @click="handleAdd" v-if="is_edit">
          <IconifyIconOffline class="edit-icon" :icon="plus" /> 添加卡片
        </el-link>
        <el-link :underline="false" @click="handleEditCancel" v-if="is_edit">
          <IconifyIconOffline class="edit-icon" :icon="close" /> 取消
        </el-link>
        <el-link :underline="false" @click="handleSave" v-if="is_edit">
          <IconifyIconOffline class="edit-icon" :icon="check" /> 完成
        </el-link>
        <el-link :underline="false" @click="handleEditView" v-if="!is_edit">
          <IconifyIconOffline class="edit-icon" :icon="edit" /> 编辑方案
        </el-link>
      </div>
    </div>
    <div class="body">
      <GetoGridLayout :layout="layout" :config="config">
        <template v-slot:gridItemBody="{ item }">
          <BeDoneAudit
            v-if="item.component == 'BeDoneAudit'"
            :title="item.name"
            :config="item"
          />
          <BeDoneWork
            v-if="item.component == 'BeDoneWork'"
            :title="item.name"
            :config="item"
          />
          <Collect v-if="item.component == 'Collect'" :title="item.name" />
          <MessageUnRead
            v-if="item.component == 'MessageUnRead'"
            :title="item.name"
            :config="item"
          />
          <MyFlow
            v-if="item.component == 'MyFlow'"
            :title="item.name"
            :config="item"
          />
          <CcMe
            v-if="item.component == 'CcMe'"
            :title="item.name"
            :config="item"
          />
          <SystemAnnouncement
            v-if="item.component == 'SystemAnnouncement'"
            :title="item.name"
            :config="item"
          />
        </template>
      </GetoGridLayout>
    </div>
    <AddDialog
      ref="adDialog"
      :cards="cards"
      :cards_checked="cards_checked"
      @addCard="addCard"
    />
  </div>
</template>

<script setup lang="ts">
import BeDoneAudit from "./components/BeDoneAudit.vue";
import BeDoneWork from "./components/BeDoneWork.vue";
import Collect from "./components/Collect.vue";
import MessageUnRead from "./components/MessageUnRead.vue";
import MyFlow from "./components/MyFlow.vue";
import CcMe from "./components/CcMe.vue";
import SystemAnnouncement from "./components/SystemAnnouncement.vue";
import AddDialog from "./components/AddDialog.vue";
import GetoGridLayout from "@/geto-components/GetoGridLayout/index.vue";
import edit from "@iconify-icons/ep/edit";
import plus from "@iconify-icons/ep/circle-plus";
import check from "@iconify-icons/ep/circle-check";
import close from "@iconify-icons/ep/circle-close";
import { ref, onMounted } from "vue";
import { getPageConf, save } from "@/geto-components/GetoMspPage/api/workbench";
import { message } from "@/utils/message";
import { useNav } from "@/layout/hooks/useNav";
import { useUserStoreHook } from "@/store/modules/user";
import { storageSession } from "@pureadmin/utils";
import { useRoute } from "vue-router";

defineOptions({
  name: "workbench"
});

const is_edit = ref(false);
const loading = ref(false);
const layout = ref([]);
const config = ref({
  backgroud: false,
  draggable: false,
  resizable: false,
  prevent_collision: false
});
const cards = ref([]);
const cards_checked = ref([]);

const adDialog = ref(null);
const handleAdd = () => {
  adDialog.value.show();
};
const handleEditView = () => {
  is_edit.value = true;
  config.value = {
    backgroud: true,
    draggable: true,
    resizable: true,
    prevent_collision: false
  };
};
const handleEditCancel = () => {
  getPageConf().then(res => {
    layout.value = res.data["layout"];
    is_edit.value = false;
    config.value = {
      backgroud: false,
      draggable: false,
      resizable: false,
      prevent_collision: false
    };
  });
};

const addCard = res => {
  // 数组过滤
  const new_layout = [];
  const layout_component = [];
  // 删除卡片
  layout.value.forEach(item => {
    if (res.checked.indexOf(item.component) > -1) {
      new_layout.push(item);
    }
    layout_component.push(item.component);
  });
  layout.value = new_layout;
  res.checked.forEach(item => {
    if (layout_component.indexOf(item) == -1) {
      layout.value.push({
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        i: item,
        name: res.cards[item],
        component: item
      });
    }
  });
};

const handleSave = () => {
  loading.value = true;
  save({
    layout: layout.value
  })
    .then(res => {
      message(res.data["msg"], { type: "success" });
      handleEditCancel();
    })
    .finally(() => {
      loading.value = false;
    });
};

const { wholeMenus } = useNav();
const route = useRoute();
onMounted(() => {
  getPageConf().then(res => {
    layout.value = res.data["layout"];
    cards.value = res.data["cards"];
    cards_checked.value = res.data["cards_checked"];
  });
  // 进入默认页面时记录日志
  const page = route.meta.title;
  let menu = "";
  wholeMenus?.value.forEach(item => {
    const children = item.children;
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child.path == route.meta.activePath) {
          menu = item.meta.title + "/" + child.meta.title;
        }
      });
    }
  });
  const log_path = "/" + menu + "/" + page + "/";
  // 写入钩子和缓存
  useUserStoreHook().SET_CLICK_LOG(log_path);
  storageSession().setItem("click-log", {
    log_path
  });
});
</script>

<style scoped>
.opt-bar {
  padding: 5px 15px 5px 15px;
  .opt-bar-btn {
    float: right;
    .edit-icon {
      margin-right: 5px;
      margin-left: 15px;
    }
  }
}

.body {
  height: 100vh;
}
</style>
