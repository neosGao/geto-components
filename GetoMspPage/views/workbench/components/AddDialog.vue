<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加卡片"
    class="dialog"
    width="35%"
  >
    <div class="body">
      <el-transfer
        v-model="cards_checked"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜索"
        :titles="['所有卡片', '已选卡片']"
        :data="cards"
        :props="{
          key: 'key',
          label: 'label',
          disabled: 'disabled'
        }"
      />
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineOptions, ref, defineProps, watch, defineEmits } from "vue";

defineOptions({
  name: "AddDialog"
});
const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  cards_checked: {
    type: Array<any>,
    default: () => []
  }
});
const emits = defineEmits(["addCard"]); // 定义发射给父组件的事件

const dialogVisible = ref(false);
const cards = ref(props.cards);
const cards_checked = ref(props.cards_checked);

watch(
  props,
  val => {
    cards.value = val.cards;
    cards_checked.value = val.cards_checked;
  },
  {
    immediate: true
  }
);

const show = () => {
  dialogVisible.value = true;
};
const filterMethod = (query, item) => {
  return item.label.indexOf(query) > -1;
};
const handleConfirm = () => {
  const cards_item = {};
  cards.value.forEach(item => {
    cards_item[item["component"]] = item["name"];
  });
  emits("addCard", { checked: cards_checked.value, cards: cards_item });
  dialogVisible.value = false;
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.dislog {
  .footer {
    text-align: center;
  }
}
</style>
