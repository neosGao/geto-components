<template>
  <div class="dark:text-white geto-search-table">
    <iframe
      @load="setFrameInit"
      ref="frameRef"
      name="iframe"
      height="100%"
      :src="frameUrl"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      width="100%"
      allowfullscreen="true"
    />
  </div>
</template>

<script setup>
import { defineOptions, ref, onMounted, onUnmounted,nextTick } from "vue";
import { useRouter } from "vue-router";
import { getIframeHost } from "@/geto-components/GetoMspPage/api/workbench";
import { storageSession } from "@pureadmin/utils";
import { usePage } from "@/geto-components/GetoUtils/page";

defineOptions({
  name: "iframeView"
});

const page = usePage();
const router = useRouter();
const frameRef = ref(null);
const frameUrl = ref("");
const routerQuery = ref(null);
const http_host = ref(null);
routerQuery.value = router.currentRoute.value.query;
console.log(routerQuery.value);

const setFrameInit = async () => {};

const sendMessage =async (data) => {
  console.log("111",data,frameUrl.value);
  await nextTick();
  frameRef.value.contentWindow.postMessage(data, frameUrl.value);
};

const initData = async () => {
  const query = routerQuery.value;
  console.log(query);
  let param = "";
  if (query.param) {
    const parseParam = JSON.parse(query.param);
    param = Object.keys(parseParam)
      .map(key => key + "=" + parseParam[key])
      .join("&");
  }

  // if (process.env.NODE_ENV == "development") {
  //   frameUrl.value = `http://192.168.64.209:8849/cloud/#${query.path}?${param}${
  //     query.param ? "&" : ""
  //   }isIframe=1`;
  //   return;
  // }
  if(query.system_code){
  const res = await getIframeHost({ code: query.system_code });
  if (res.code == "0") {
    http_host.value = res.data[0].url;
    frameUrl.value = `${http_host.value}/#${query.path}?${param}${
      query.param ? "&" : ""
    }isIframe=1`;
    console.log(frameUrl.value);
  }
  }else{
     frameUrl.value=query.url
  }
};
initData();

const messageFn = async event => {
  const res = event.data;
  if (res.type == "closeRouter") {
    if (res.removeTitle) {
      page.closeTagsByPathNoJump(`/iframeView${res.removeTitle}`);
    }
  }
  if (res.type == "router") {
    if (res.removeTitle) {
      page.closeTagsByPathNoJump(`/iframeView${res.removeTitle}`);
    }
    page.addIframePage(res.title, res.query);
  }
  if (res.type == "getToken") {
    const userInfo = storageSession().getItem("user-info");

    console.log("send iframeLogin");
    if (
      res.userInfo &&
      res.userInfo.set_data.uc_session_id == userInfo.set_data.uc_session_id
    ) {
      sendMessage({
        isSuccessLogin: 1,
        type: "setToken"
      });
    } else {
      sendMessage({
        set_data: userInfo.set_data,
        type: "setToken"
      });
    }
  }
};

onMounted(() => {
  window.addEventListener("message", messageFn, true);
});
// 销毁
onUnmounted(() => {
  window.removeEventListener("message", messageFn, true);
});
</script>

<style lang="scss" scoped></style>
