<template>
  <el-dialog v-model="dialogVisible" title="用户扮演" width="30%">
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          扮演
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({
  name: "GetoRolePlaySetting"
});
import { ref } from "vue";

const dialogVisible = ref(false);

const show = () => {
  dialogVisible.value = true;
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped></style>
