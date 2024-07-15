<script setup lang="ts">
import "@vue-office/docx/lib/index.css";
import VueOfficeDocx from "@vue-office/docx";
import { defineProps, ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Word"
});

defineProps({
  source: {
    type: String,
    default: ""
  }
});

const { t } = useI18n();
const loading = ref(true);
function rendered() {
  loading.value = false;
}
</script>

<template>
  <div
    v-loading="loading"
    :element-loading-text="t('加载中')"
    style="min-height: 300px"
  >
    <vue-office-docx :src="source" @rendered="rendered" />
  </div>
</template>
