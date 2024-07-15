<template>
  <el-dialog
    v-model="dialogVisible"
    title="预览"
    width="90%"
    :close-on-click-modal="false"
    lock-scroll
    align-center
    destroy-on-close
  >
    <div class="preview-wrap">
      <FormDisplay
        ref="formDisplayRef"
        v-if="dialogVisible"
        :data="displayData"
        action
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import FormDisplay from "@/geto-components/GetoFormDisplay/index.vue";

defineOptions({
  name: "FormPreviewIndex"
});
const dialogVisible = ref(false);

const formDisplayRef = ref<InstanceType<typeof FormDisplay> | null>(null);

const displayData = ref<any[]>([]);
const show = data => {
  displayData.value = data;
  dialogVisible.value = true;
};

const handleConfirm = () => {
  dialogVisible.value = false;
};

defineExpose({
  show
});
</script>
<style lang="scss" scoped>
.preview-wrap {
  height: 70vh;
  overflow-y: auto;
}
</style>
