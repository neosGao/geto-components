<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, nextTick } from "vue";
import { useVModel } from "@vueuse/core";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor, IToolbarConfig } from "@wangeditor/editor";

defineOptions({
  name: "GetoRichText"
});

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  mode: {
    type: String,
    default: "default"
  },
  placeholder: {
    type: String,
    default: "请输入内容..."
  },
  insertKeys: {
    type: Object as PropType<{ index: number; keys: string[] }>,
    default: () => {}
  },
  excludeKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  showToolbar: {
    type: Boolean,
    default: true
  }
});
const emits = defineEmits(["update:modelValue"]);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 工具栏配置
const toolbarConfig = ref<Partial<IToolbarConfig>>({
  insertKeys: props.insertKeys,
  excludeKeys: props.excludeKeys
});
// 编辑器配置
const editorConfig = ref({
  placeholder: props.placeholder
});

const valueHtml = useVModel(props, "modelValue", emits);

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  nextTick(() => {
    const toolbar = DomEditor.getToolbar(editor);
    const curToolbarConfig = toolbar?.getConfig();
    console.log(curToolbarConfig);
  });
};

const getHtml = () => {
  return editorRef.value?.getHtml() || "";
};
const getText = () => {
  return editorRef.value?.getText() || "";
};

const insertHtml = html => {
  editorRef.value.focus();
  editorRef.value.dangerouslyInsertHtml(html);
};

defineExpose({
  getHtml,
  getText,
  insertHtml
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<template>
  <div class="h-full w-full">
    <Toolbar
    v-if="props.showToolbar"
      class="border border-gray-300 border-b-red-50"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <div class="editor-wrapper border border-gray-300">
      <Editor
        class="overflow-y-hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-wrapper {
  width: 100%;
  height: calc(100% - 44px);
}
</style>
