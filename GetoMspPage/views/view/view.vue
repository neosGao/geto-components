<!--
 * @Author: 邱永健 qyj@geto.com.cn
 * @Date: 2024-04-18 18:11:28
 * @LastEditors: 邱永健 qyj@geto.com.cn
 * @LastEditTime: 2024-04-24 16:52:14
 * @FilePath: \sells\src\geto-components\GetoMspPage\views\view\view.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dark:text-white geto-step-form">
    <GetoBackBar>
      <template #title>
        <span class="font-medium">
          <el-link :href="file_link">
            {{ file_name }}
          </el-link>
        </span>
      </template>
    </GetoBackBar>
    <div class="body">
      <pdf ref="pdf" :source="source" v-if="extension == 'pdf'" />
      <word
        ref="word"
        :source="source"
        v-if="extension == 'doc' || extension == 'docx'"
      />
      <excel
        ref="excel"
        :source="source"
        v-if="extension == 'xls' || extension == 'xlsx'"
      />
      <el-image
       v-if="['png','jpg','jpeg'].includes(extension)"
      :src="source" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GetoBackBar from "@/geto-components/GetoBackBar/index.vue";
import { onMounted, ref } from "vue";
import { fileDetail } from "@/geto-components/GetoApi/file";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import Pdf from "./pdf/pdf.vue";
import Word from "./word/word.vue";
import Excel from "./excel/excels.vue";

defineOptions({
  name: "file_view"
});

const router = useRouter();
const file_id = ref(router.currentRoute.value.query.file_id);
const file_name = ref("");
const file_link = ref("");
const source = ref("");
const extension = ref("");
const loadFile = async () => {
  if (file_id.value == "") {
    message("文件ID不能为空", { type: "warning" });
    return;
  }
  const query = {
    ids: [file_id.value]
  };
  const res: any = await fileDetail(query);
  if (res.code != "0") {
    return;
  }
  file_name.value = res.data[0].name;
  file_link.value = res.data[0].download;
  source.value = res.data[0].download;
  extension.value = res.data[0].extension;
};
// 挂载
onMounted(() => {
  loadFile();
});
</script>

<style lang="scss" scoped>
.body {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}
</style>
