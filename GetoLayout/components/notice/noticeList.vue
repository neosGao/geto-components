<script setup lang="ts">
import { PropType } from "vue";
import { ListItem } from "./data";
import NoticeItem from "./noticeItem.vue";

const props = defineProps({
  list: {
    type: Array as PropType<Array<ListItem>>,
    default: () => []
  }
});
const emits = defineEmits(["clickNotice"]);
const clickNotice = noticeItem => {
  emits("clickNotice", noticeItem);
};
</script>

<template>
  <div v-if="props.list.length">
    <NoticeItem
      v-for="(item, index) in props.list"
      :noticeItem="item"
      :key="index"
      @clickNotice="clickNotice"
    />
  </div>
  <el-empty v-else description="暂无数据" />
</template>
