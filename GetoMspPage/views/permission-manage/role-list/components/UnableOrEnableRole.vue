<template>
  <div>
    <el-dropdown
      split-button
      @click="handleUnableOrenable()"
      @command="handleCommand"
    >
      禁用
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="enable">启用</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { unableEnableRole } from "@/geto-components/GetoMspPage/api/role-list";
import { message } from "@/utils/message";
const props = defineProps({
  ids: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["onSearch"]);

const handleCommand = (command: string) => {
  if (command === "enable") {
    handleUnableOrenable(1);
  }
};

const handleUnableOrenable = async (type = 0) => {
  const res: any = await unableEnableRole({ ids: props.ids, status: type });
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};
</script>
