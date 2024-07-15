<script setup lang="ts">
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import SidebarItem from "./sidebarItem.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { ref, nextTick, computed } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import GetoSwitchSystem from "@/geto-components/GetoSwitchSystem/index.vue";
import switch_icon from "@iconify-icons/ep/switch";
import userFilled from "@iconify-icons/ep/user-filled";
import GetoRolePlay from "@/geto-components/GetoRolePlay/index.vue";
import GetoRolePlaySetting from "@/geto-components/GetoRolePlaySetting/index.vue";

const menuRef = ref();

const {
  route,
  title,
  logout,
  backTopMenu,
  onPanel,
  username,
  userAvatar,
  avatarsStyle,
  is_role_play,
  can_role_play
} = useNav();

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path
);

nextTick(() => {
  menuRef.value?.handleResize();
});

const getoRolePlaySetting = ref(null);
const handleRolePlay = () => {
  getoRolePlaySetting.value?.show();
};
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header"
  >
    <div class="horizontal-header-left" @click="backTopMenu">
      <img src="/logo.svg" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 角色扮演 -->
      <GetoRolePlay v-if="is_role_play" />
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 切换系统 -->
      <GetoSwitchSystem />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item>
              <IconifyIconOffline :icon="userFilled" style="margin: 5px" />
              用户中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleRolePlay" v-if="can_role_play">
              <IconifyIconOffline :icon="switch_icon" style="margin: 5px" />
              用户扮演
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        title="打开项目配置"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
      <GetoRolePlaySetting ref="getoRolePlaySetting" v-if="can_role_play" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.logout {
  max-width: 120px;

  :deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
