<template>
  <div>
    <el-button type="danger" @click="handleDelRole">删除</el-button>
  </div>
</template>

<script lang="ts" setup>
import { delRole } from "@/geto-components/GetoMspPage/api/role-list";
import { message } from "@/utils/message";
const props = defineProps({
  ids: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["onSearch"]);

const handleDelRole = async () => {
  const res: any = await delRole({ ids: props.ids });
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};
</script>
