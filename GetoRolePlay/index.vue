<template>
  <div class="flex-c navbar-bg-red">
    <p class="title">你正在扮演 {{ user_info["play_user"] }}</p>
    <el-link class="stop" :underline="false" @click="handleStopPlay"
      >停止扮演</el-link
    >
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "GetoRolePlay"
});
import { storageSession } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";

const sessionKey = "user-info";
const user_info = storageSession().getItem(sessionKey);

/**
 * 停止扮演
 */
const handleStopPlay = () => {
  // todo 待补充后端逻辑
  const set_data = user_info["set_data"];
  const refresh_token = user_info["refresh_token"];
  const expires = user_info["expires"];
  const username = user_info["username"];
  const roles = user_info["roles"];
  const is_role_play = false;
  const play_user = "";
  const can_role_play = user_info["can_role_play"];
  const current_org = user_info["current_org"];
  const org_list = user_info["org_list"];

  storageSession().setItem(sessionKey, {
    refresh_token,
    expires,
    username,
    roles,
    is_role_play,
    play_user,
    can_role_play,
    current_org,
    org_list,
    set_data
  });
  useUserStoreHook().SET_IS_ROLE_PLAY(false);
  message("停止扮演成功", { type: "success" });
};
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin-right: 30px;
}
.stop {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.navbar-bg-red {
  background-color: #f56c6c;
  border-radius: 2px;
  width: 220px;
  height: 48px;
}
</style>
