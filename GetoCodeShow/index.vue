<template>
  <GetoBackBar :title="props.componentTitle" routeName="role_list" />
  <div class="dark:text-white component-demo">
    <div>
      <component :is="props.currentComponent" v-if="props.currentComponent" />
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template #title>
          <h3>代码示例</h3>
        </template>
        <prism language="js">{{ props.codeExample }}</prism>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import "prismjs";
// import "prismjs/themes/prism.css";
import "prismjs/themes/prism-tomorrow.min.css";
import Prism from "vue-prism-component";
import { onMounted, defineProps, defineOptions, ref } from "vue";
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";

defineOptions({
  name: "GetoCodeShow"
});
const props = defineProps({
  componentTitle: {
    type: String,
    default: () => ""
  },
  currentComponent: {
    type: String,
    default: () => ""
  },
  codeExample: {
    type: String,
    default: () => ""
  }
});
const activeNames = ref(["1"]);
onMounted(() => {});
</script>

<style scoped>
.component-demo {
  padding: 20px;
  border-radius: 2px;
  background-color: #fff;
  margin-top: 10px;
}

.code-section {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 10px;
}
</style>
