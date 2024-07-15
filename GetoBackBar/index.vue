<template>
  <div class="geto-back-bar">
    <el-page-header @back="onBack">
      <template #icon>
        <IconifyIconOffline :icon="Back" />
      </template>
      <template #content>
        <span class="text-large font-600 mr-3"> {{ props.title }} </span>
        <slot name="title" />
      </template>
      <template #extra>
        <slot name="extra" />
      </template>
    </el-page-header>
  </div>
</template>

<script lang="ts" setup>
import Back from "@iconify-icons/ep/back"; //ep:back
import { useRouter } from "vue-router";
import { defineOptions, defineProps, defineExpose } from "vue";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
defineOptions({
  name: "GetoBackBar"
});

const router = useRouter();
const props = defineProps({
  title: {
    type: String,
    default: () => ""
  },
  routeName: {
    type: String,
    default: () => ""
  },
  close_tag: {
    type: Boolean,
    default: () => false
  }
});

const env = import.meta.env;

const onBack = () => {
  // 返回上一页
  if (env.MODE == "development" || env.VITE_VERSION == "MSP") {
    const currentPath = router.currentRoute.value.path;
    if (props.routeName) {
      router.push({
        name: props.routeName
      });
    } else {
      router.go(-1);
    }
    // 关闭当前tags
    if (props.close_tag) {
      useMultiTagsStoreHook().handleTags("splice", currentPath);
    }
    return;
  }

  // ms架构的跳转
  const routes = router.getRoutes();
  const route = routes.find(item => item.name == props.routeName);
  const host = env.VITE_PUBLIC_PATH + "#";
  const title = route.meta.title;
  const url = host + route.path + "?title=" + title;
  const params = [
    {
      name: title,
      path: url,
      url: url,
      state: 5
    }
  ];
  window.parent.postMessage({ flag: "tab", data: params }, "*"); //解决跨域
  window.parent.postMessage({ flag: "loading", data: { loading: false } }, "*");
};

defineExpose({
  onBack
});
</script>

<style lang="scss" scoped>
.geto-back-bar {
  background-color: #fff;
  padding: 10px;
}
</style>
