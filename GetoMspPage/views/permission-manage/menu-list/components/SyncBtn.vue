<template>
  <div>
    <el-button @click="handleDelRole">同步</el-button>
  </div>
</template>

<script lang="ts" setup>
import { syncData } from "@/geto-components/GetoMspPage/api/menu";
import { message } from "@/utils/message";

const emit = defineEmits(["onSearch"]);

const handleDelRole = async () => {
  const res: any = await syncData();
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};
</script>
