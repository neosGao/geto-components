<template>
  <div>
    <el-button @click="handleDelRole">同步</el-button>
  </div>
</template>

<script lang="ts" setup>
import { syncData } from "@/geto-components/GetoMspPage/api/operate-manage";
import { message } from "@/utils/message";
const props = defineProps({
  ids: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(["onSearch"]);

const handleDelRole = async () => {
  const res: any = await syncData({ ids: props.ids });
  onSearch(res);
  message(res.data.msg, { type: "success" });
};

const onSearch = res => {
  if (res.code != "0") return;
  emit("onSearch");
};
</script>
