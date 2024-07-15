<template>
  <div
    class="search-container w-[200px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
  >
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="org-box">
        <p class="dark:text-white org">
          {{ current_org["label"] }}
        </p>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in org_list"
            :key="index"
            :command="item['value']"
          >
            {{ item["label"] }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { setOrg } from "@/geto-components/GetoApi/org";
import { message } from "@/utils/message";
import { storageSession } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { loadUserPermissionKey } from "@/geto-components/GetoUtils/permission";

defineOptions({
  name: "GetoSwitchOrg"
});

import { h } from "vue";
const current_org = ref(useUserStoreHook()?.current_org);
const org_list = ref(useUserStoreHook()?.org_list);
const sessionKey = "user-info";
const user_info = storageSession().getItem(sessionKey);
const router = useRouter();

const handleCommand = (command: number) => {
  ElMessageBox.confirm("", "组织切换确认", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    message: h("p", null, [
      h("p", { style: "color: red" }, "组织切换后将关闭当前打开的所有页面。"),
      h("p", { style: "color: red" }, "请提前保存好相关单据数据。"),
      h("p", { style: "color: red" }, "是否确认进行组织切换？")
    ])
  })
    .then(() => {
      setOrg({
        organization_id: command
      }).then((res: any) => {
        let change_org = {};
        org_list.value.forEach((item: any) => {
          if (item.value === command) {
            change_org = item;
          }
        });
        current_org.value = change_org;
        user_info["current_org"] = change_org;
        useUserStoreHook().SET_CURRENT_ORG(change_org);
        storageSession().setItem(sessionKey, user_info);
        message(res.data.msg, { type: "success" });
        // 关闭所有页面并，刷新
        loadUserPermissionKey().then(() => {
          router
            .push({
              name: "workbench"
            })
            .finally(() => {
              window.location.reload();
            });
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消切换"
      });
    });
};
</script>

<style lang="scss" scoped>
.org-box {
  text-align: center;
}
.org {
  height: 40px;
  width: 170px;
  margin-top: 25px;
  // 超出宽度显示省略号
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏超出容器的文本 */
  text-overflow: ellipsis;
  /* 显示省略号 */
}
</style>
