<template>
  <div>
    <el-button
      type="primary"
      v-print="props.options ?? '#' + props.printId"
      class="mb-2"
      >打印</el-button
    >
    <el-button type="primary" v-if="props.exportBtn" @click="handleExport"   class="mb-2"
      >导出</el-button
    >
    <br />
    <div :id="props.printId" class="inline-block">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  options: {
    type: Object,
    default: () => {}
  },
  printId: {
    type: String,
    default: () => "printPage"
  },
  exportBtn: {
    type: Boolean,
    default: () => false
  }
});
const emit = defineEmits(["onExport"]);

const handleExport = () => {
  emit("onExport");
};
</script>
