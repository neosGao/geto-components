<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <div v-loading="loading" :element-loading-text="describe" class="mb-10" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" link @click="handleStop">
          人工终止操作
        </el-button>
        <el-button type="primary" link @click="openWindow">
          跳转协作页面
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineExpose, onMounted } from "vue";
import { storeInteract, stopInteract, getInteract } from "./api";
import { message } from "@/utils/message";

const prop = defineProps({
  title: {
    type: String,
    default: ""
  },
  describe: {
    type: String,
    default: "正在进行跨系统协助，请耐心等待"
  },
  interact_type: {
    type: String,
    default: ""
  }
});

const dialogVisible = ref(false);
const loading = ref(false);
const url = ref("");
const { VITE_APP_ID } = import.meta.env;
const show = async (params: any) => {
  url.value = "";
  const res: any = await storeInteract({
    interact_type: prop.interact_type,
    source: VITE_APP_ID,
    params: params
  });
  if (res.code != "0") {
    return;
  }
  url.value = res.data.url;
  loading.value = true;
  dialogVisible.value = true;
  polling();
  openWindow();
};
// 全局变量，用于存储窗口引用
let my_window;
const openWindow = () => {
  // 检查窗口是否已经打开且未被关闭
  if (my_window && !my_window.closed) {
    // 窗口存在，刷新窗口
    my_window.location.href = url.value;
  } else {
    // 窗口不存在，打开新窗口
    my_window = window.open(url.value, prop.interact_type);
  }

  // 确保新窗口或刷新的窗口获得焦点
  if (my_window) {
    my_window.focus();
  }
};
const is_handle_stop = ref(false);
const handleStop = async () => {
  await stopInteract({
    interact_type: prop.interact_type
  }).then((res: any) => {
    message(res.data.msg, {
      type: "success"
    });
    is_handle_stop.value = true;
    loading.value = false;
    dialogVisible.value = false;
  });
};
// 轮询获取互动状态
const polling = async () => {
  const res: any = await getInteract({
    interact_type: prop.interact_type
  });
  if (res.data.status == 1) {
    loading.value = false;
    if (!is_handle_stop.value) {
      message("操作完成", {
        type: "success"
      });
    }
    dialogVisible.value = false;
    return;
  }

  setTimeout(() => {
    polling();
  }, 1500);
};
// 检查是否是页面刷新中断
const checkInteract = () => {
  getInteract({
    interact_type: prop.interact_type
  }).then((res: any) => {
    if (res.data.status == 0) {
      loading.value = true;
      dialogVisible.value = true;
      polling();
      openWindow(res.url);
      return;
    }
  });
};

onMounted(() => {
  checkInteract();
});
defineExpose({
  show
});
</script>
