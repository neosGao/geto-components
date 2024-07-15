<template>
  <div>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ props.title }}</h4>
      </template>
      <template #default>
        <div>
          <GetoTaskLog />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GetoTaskLog from "@/geto-components/GetoTaskLog/index.vue";
const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});

const drawer = ref(false);

const show = async id => {
  console.log(id);

  drawer.value = true;
};

defineExpose({
  show
});
</script>
