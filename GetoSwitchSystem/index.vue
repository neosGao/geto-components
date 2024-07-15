<template>
  <div
    class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
    @click="handleShow"
  >
    <IconifyIconOffline :icon="switch_icon" class="switch_icon" />
    <el-drawer
      v-model="switchDialogVisible"
      direction="rtl"
      :append-to-body="true"
    >
      <template #header>
        <h4>系统切换</h4>
      </template>
      <template #default>
        <div v-if="systems.length > 0">
          <el-row :gutter="20">
            <el-col
              :span="6"
              v-for="(item, index) in systems"
              :key="index"
              class="mb-8 box"
            >
              <div class="system" @click="handleSwitch(item)">
                <el-avatar
                  shape="square"
                  class="system-icon"
                  :src="item['logo']"
                />
                <el-text truncated>{{ item.name }}</el-text>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-empty description="暂无可切换的系统" v-else />
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import switch_icon from "@iconify-icons/ep/menu";
import { ref } from "vue";
import { getSystemList } from "@/geto-components/GetoApi/uc";

defineOptions({
  name: "GetoSwitchSystem"
});

const loading = ref(false);
const switchDialogVisible = ref(false);
const systems = ref([]);

const handleShow = () => {
  loading.value = true;
  getSystemList()
    .then((res: any) => {
      systems.value = res.data;
      switchDialogVisible.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSwitch = system => {
  window.open(system.url, "_blank");
};
</script>

<style lang="scss" scoped>
.box:hover {
  background: #fff;
}
.system {
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background: #fff;
  .system-icon {
    background: #fff;
    width: 80px;
    height: 80px;
  }
}
.system:hover {
  background: #fff;
  cursor: pointer;
  // 阴影
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
