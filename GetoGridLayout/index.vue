<template>
  <div class="box" ref="box" v-infinite-scroll="handleScroll">
    <grid-layout
      v-model:layout="layout"
      :col-num="col_num"
      :row-height="row_height"
      :is-draggable="props.config.draggable"
      :is-resizable="props.config.resizable"
      :margin="[10, 10]"
      :preventCollision="props.config.prevent_collision"
      :responsive="false"
      :vertical-compact="false"
      :use-css-transforms="true"
    >
      <!-- 确保在其他 item 下面，放在第一个的会在最下面 -->
      <template v-if="props.config.backgroud">
        <grid-item
          v-for="item in back_layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          :is-draggable="false"
          :is-resizable="false"
          class="backGridItem"
        />
      </template>

      <!-- 真正的layout数据 -->
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        class="gridItem"
      >
        <slot name="gridItemBody" :item="item" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script setup lang="ts">
import { message } from "@/utils/message";
import { defineOptions, defineProps, ref, onMounted, watch } from "vue";

defineOptions({
  name: "getoGridLayout"
});
const props = defineProps({
  layout: {
    type: Array<any>,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({
      backgroud: true,
      draggable: true,
      resizable: true,
      prevent_collision: false
    })
  }
});

const col_num = ref(12);
const row_height = ref(80);
const max_row = ref(100);
const current_row = ref(0);

const box = ref(null);
const back_layout = ref([]);
const layout = ref(props.layout);

watch(
  props,
  val => {
    layout.value = val.layout;
  },
  {
    immediate: true
  }
);

const genBackGroud = row => {
  // 生成back_layout数据
  const column = col_num.value;
  // 获取数组最后一条数据
  let y_index = 0;
  if (back_layout.value.length > 0) {
    const last_item = back_layout.value[back_layout.value.length - 1];
    y_index = last_item.y + 1;
    if (y_index >= max_row.value) {
      message("布局容器最大行数为" + (y_index - 1), { type: "warning" });
      return;
    }
  }

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < column; x++) {
      back_layout.value.push({
        x: x,
        y: y + y_index,
        w: 1,
        h: 1,
        i: y * column + x + ""
      });
    }
  }
};

const handleScroll = () => {
  if (!props.config.backgroud) {
    return;
  }
  current_row.value = current_row.value + 2;
  genBackGroud(2);
};
// 挂载
onMounted(() => {
  const box_height = box.value.clientHeight;
  // 取整
  const row = Math.ceil(box_height / row_height.value);
  genBackGroud(row);
  current_row.value = row;
});
</script>

<style scoped>
.box {
  height: 100vh;
}
.backGridItem {
  background-color: #e9e9eb;
  border-radius: 2px;
}
.gridItem {
  /* background-color: #d1edc4; */
  border-radius: 2px;
}
</style>
