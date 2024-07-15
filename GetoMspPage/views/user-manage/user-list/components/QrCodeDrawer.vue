<template>
  <el-drawer
    width="20%"
    v-model="drawer"
    title="用户二维码"
    :before-close="onClose"
  >
    <div class="qr-center">
      <el-card
        shadow="never"
        style="width: 250px"
        :body-style="{ padding: '10px' }"
      >
        <div v-if="showQr">
          <qrcode-vue
            :value="userInfo.qrcode"
            level="H"
            :size="200"
            margin="1"
            class="image"
          />
        </div>
        <div v-if="!showQr">
          <el-empty
            :image-size="150"
            style="padding: 0"
            description="暂无用户二维码，请到用户中心创建"
          />
        </div>

      </el-card>
    </div>
    <div style="padding: 14px;text-align: center;">
          <span
          >{{ userInfo.name }}
            <span class="time">{{ userInfo.work_id }}</span></span
          >
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { message } from "@/utils/message";
import QrcodeVue from "qrcode.vue";

const props = defineProps({
  selectedUser: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["onSearch"]);

const drawer = ref(false);
const needSearch = ref(false);
const showQr = ref(false);
const logData = ref([]);

const userInfo = ref({
  id: "",
  name: "",
  work_id: "",
  email: "",
  qrcode: ""
});

const show = async () => {
  if (props.selectedUser.length != 1) {
    message("请选择一位用户", { type: "warning" });
    return;
  }

  userInfo.value = props.selectedUser[0];

  drawer.value = true;
  needSearch.value = false;
  showQr.value = !!userInfo.value.qrcode;

  logData.value = [];
};

const onClose = () => {
  drawer.value = false;
  if (!needSearch.value) return;

  emit("onSearch");
};

defineExpose({
  show
});
</script>

<style>
.time {
  font-size: 12px;
  color: #999;
}
.qr-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
