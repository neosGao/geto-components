<script setup lang="ts">
import extraIcon from "./extraIcon.vue";
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { ref, toRaw, watch, onMounted, nextTick } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import draggable from "vuedraggable";
import GetoSwitchSystem from "@/geto-components/GetoSwitchSystem/index.vue";
import switch_icon from "@iconify-icons/ep/switch";
import userFilled from "@iconify-icons/ep/user-filled";
import GetoRolePlay from "@/geto-components/GetoRolePlay/index.vue";
import GetoRolePlaySetting from "@/geto-components/GetoRolePlaySetting/index.vue";

const menuRef = ref();
const defaultActive = ref(null);

const {
  route,
  device,
  logout,
  onPanel,
  resolvePath,
  username,
  userAvatar,
  getDivStyle,
  avatarsStyle,
  is_role_play,
  can_role_play
} = useNav();

function getDefaultActive(routePath) {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  /** 当前路由的父级路径 */
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = !isAllEmpty(route.meta?.activePath)
    ? route.meta.activePath
    : findRouteByPath(parentRoutes, wholeMenus)?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
});

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getDefaultActive(route.path);
  }
);

const getoRolePlaySetting = ref(null);
const handleRolePlay = () => {
  getoRolePlaySetting.value?.show();
};
</script>

<template>
  <div
    v-if="device !== 'mobile'"
    class="horizontal-header"
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
  >
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <draggable
        :list="usePermissionStoreHook().wholeMenus"
        item-key="path"
        style="display: flex"
      >
        <template #item="{ element }">
          <el-menu-item :index="resolvePath(element) || element.redirect">
            <template #title>
              <div
                v-if="toRaw(element.meta.icon)"
                :class="['sub-menu-icon', element.meta.icon]"
              >
                <component
                  :is="useRenderIcon(element.meta && toRaw(element.meta.icon))"
                />
              </div>
              <div :style="getDivStyle">
                <span class="select-none">
                  {{ element.meta.title }}
                </span>
                <extraIcon :extraIcon="element.meta.extraIcon" />
              </div>
            </template>
          </el-menu-item>
        </template>
      </draggable>
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
        <span class="el-dropdown-link navbar-bg-hover select-none">
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
