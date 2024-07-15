<template>
  <div class="geto-step">
    <el-steps
      :active="props.config.active"
      align-center
      finish-status="success"
      :simple="props.config.simple"
    >
      <template v-for="(item, index) in props.config.titleArr" :key="index">
        <el-step :title="item.title" :description="item.description" />
      </template>
    </el-steps>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "GetoStep"
});
const props = defineProps({
  config: {
    type: Object,
    default: () => {}
  }
});
</script>

<style lang="scss" scoped>
.geto-step {
  background-color: #fff;
  // padding: 20px 0px 20px 20px;
  border-radius: 4px;
}
</style>
