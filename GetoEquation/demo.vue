<template>
  <GetoEquation
    title="算式编辑器"
    v-model="equationValue"
    v-model:visible="equationDialog"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";
import GetoEquation from "@/geto-components/GetoEquation/index.vue";
defineOptions({
  name: "GetoEquationDemo"
});

const equationValue = ref("");
const equationDialog = ref(true);
</script>

<style lang="scss" scoped></style>
