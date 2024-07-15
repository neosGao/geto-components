<template>
  <el-card shadow="hover" class="card" :body-style="{ padding: '10px 15px' }">
    <div class="head">
      <p>{{ title }}</p>
    </div>
    <div class="body" v-loading="loading">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-button round class="btn" @click="collect">
            <IconifyIconOffline class="icon" :icon="plus" />
            点击添加</el-button
          >
        </el-col>
        <el-col :span="8" v-for="(item, index) in list" :key="index">
          <el-button round class="btn" @click="jump(item)">
            <IconifyIconOffline class="icon" :icon="menu" />
            <span class="btn-text">{{ item.label }}</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <MenuCollectDailog ref="menuCollectDailog" @collect="loadData" />
  </el-card>
</template>

<script setup lang="ts">
import plus from "@iconify-icons/ep/plus";
import menu from "@iconify-icons/ep/menu";
import { defineOptions, defineProps, ref, onMounted } from "vue";
import { getComponentData } from "@/geto-components/GetoMspPage/api/workbench";
import MenuCollectDailog from "./MenuCollectDailog.vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "Collect"
});
defineProps({
  title: {
    type: String,
    default: ""
  }
});

const loading = ref(false);
const list = ref([]);
const menuCollectDailog = ref(null);
const router = useRouter();

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "Collect"
  })
    .then((res: any) => {
      list.value = res.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const collect = () => {
  menuCollectDailog.value.show();
};

const jump = item => {
  router.push({
    name: item.key
  });
  return;
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  height: 5px;
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #c9c9cf;
  border-radius: 6px;
}

.card {
  height: 100%;
  .body {
    padding-top: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 700px;
    padding-right: 5px;
    padding-bottom: 150px;
    .btn {
      width: calc(100%);
      margin-bottom: 10px;
    }
    .btn-text {
      // 超出宽度显示省略号
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 隐藏超出容器的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
      width: calc(100%);
    }
    .icon {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>
