<template>
  <div class="print-area" :style="`width:` + width + `;height:` + height">
    <!-- 模板插槽 -->
    <slot name="printTemplate" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
defineOptions({
  name: "GetoPrintTemplate"
});
const props = defineProps({
  page_type: {
    type: String,
    default: "A4"
  },
  direction: {
    type: String,
    default: "vertical"
  }
});
const config = ref({
  A3: {
    vertical: {
      width: "297mm",
      height: "420mm"
    },
    horizontal: {
      width: "420mm",
      height: "297mm"
    }
  },
  A4: {
    vertical: {
      width: "210mm",
      height: "297mm"
    },
    horizontal: {
      width: "297mm",
      height: "210mm"
    }
  }
});
const width = ref("");
const height = ref("");
watch(
  () => props.page_type,
  val => {
    width.value = config.value[val][props.direction].width;
    height.value = config.value[val][props.direction].height;
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.print-area {
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  page-break-after: always;
  page-break-inside: avoid;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
  @media print {
    width: 100%;
    height: 100%;
  }
}
</style>
