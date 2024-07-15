<template>
  <el-card shadow="hover" class="card" :body-style="{ padding: '0px' }">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div class="card-header-btn">
          <slot name="card_header_btn" />
          <el-link :underline="false" @click="handleRefresh">
            <IconifyIconOffline class="refresh-icon" :icon="refresh" />
          </el-link>
        </div>
      </div>
    </template>
    <div class="card-body" :style="'height:' + height">
      <slot name="card_body" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import refresh from "@iconify-icons/ep/refresh"; //ep:refresh
import { defineEmits, defineProps, defineOptions, onMounted, ref } from "vue";

const emits = defineEmits(["onRefresh"]); // 定义发射给父组件的事件

defineOptions({
  name: "GetoWorkbenchcCard"
});
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  h: {
    type: Number,
    default: 1
  }
});

const handleRefresh = () => {
  emits("onRefresh");
};
const height = ref("80px");
onMounted(() => {
  height.value = props.h * 80 - 20 + "px";
});
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  :deep(.el-card__header) {
    padding: 10px 15px;
  }
  .card-header {
    .card-header-btn {
      float: right;
      .refresh-icon {
        font-size: 16px;
      }
    }
  }
  .card-body {
    padding: 10px 15px 20px 15px;
    overflow-y: scroll;
  }
  // 滚动条样式
  ::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
