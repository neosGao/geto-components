<script setup lang="ts">
import "@vue-office/excel/lib/index.css";
import VueOfficeExcel from "@vue-office/excel";
import { defineProps, ref } from "vue";
import { message } from "@/utils/message";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Excels"
});
defineProps({
  source: {
    type: String,
    default: ""
  }
});

const { t } = useI18n();
const loading = ref(true);
function renderedHandler() {
  loading.value = false;
}

function errorHandler() {
  message("渲染失败", { type: "error" });
}
</script>

<template>
  <div
    v-loading="loading"
    :element-loading-text="t('加载中')"
    style="min-height: 300px"
  >
    <vue-office-excel
      :src="source"
      style="height: 100vh"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
  </div>
</template>
