<template>
  <div class="tinymceDiv">
    <textarea :id="id" />
  </div>
</template>
<script>
import { getFileUploadSingleStrategy } from "@/geto-components/GetoApi/file";
import { getTokenStr } from "@/utils/auth";
import tinymce from "tinymce/tinymce";
//这下面是tinymce的插件

// package.json增加2个依赖包，然后执行 pnpm install
// "tinymce": "^5.10.1",
// "@tinymce/tinymce-vue": "^5.1.1",
// 需要将组件的皮肤css文件 node_modules/tinymce/skins 拷贝到public

//5.0+版本会页面显示not Found，引入图标可以解决这个问题 2021.11.11添加
import "tinymce/icons/default/icons.js"; // 引入图标包 icons.js

import "tinymce/themes/silver/theme";
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/code"; //显示源代码插件
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/paste";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/contextmenu";
const env = import.meta.env;
//这里写你自己存放语言包的路径
import "./langs/zh_CN.js";
export default {
  name: "",
  props: {
    id: String,
    tinyVal: String //内容绑定
  },
  data() {
    return {
      init: {
        selector: "#" + this.id,
        language: "zh_CN",
        skin_url: "tinymce/skins/ui/oxide/", // 需要将 node_modules/tinymce/skins 目录拷贝到public
        content_css: "tinymce/skins/content/default/content.css",
        //插件-实现插入图片等功能
        plugins:
          "link lists image code table colorpicker textcolor wordcount contextmenu",
        //工具栏-根据自己需要增减功能
        toolbar:
          "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
        branding: false,
        menubar: true, //顶部菜单栏显示
        min_height: 450, //高度
        statusbar: false,
        convert_urls: false,
        images_upload_handler: (blobInfo, success, failure, progress) =>
          new Promise((resolve, reject) => {
            progress(0);
            const data = new FormData();
            data.append("file", blobInfo.blob());
            data.append("fileName", blobInfo.filename());
            const headers = {
              token: getTokenStr(),
              Accept: "application/json, text/plain, */*",
              "Content-Type": "multipart/form-data",
              "X-Requested-With": "XMLHttpRequest"
            };
            const mode = env.MODE;
            if (mode == "development") {
              headers["X-User-Id"] = 1; // 37
            } else {
              headers["Authorization"] = "Bearer " + getTokenStr();
            }
            getFileUploadSingleStrategy(data, headers)
              .then(response => {
                const url = response.data.lastingUrl;
                // url = url.replace(
                //   /\/api/,
                //   `${process.env.VUE_APP_BASE_API}/api`
                // );
                console.log(222);
                success(url);
                resolve(url);
                progress(100);
              })
              .catch(() => {
                reject("出现未知问题，刷新页面，或者联系程序员");
              });
          })
      }
    };
  },
  methods: {
    /**外部调用该方法，可以拿到绑定数据*/
    getData() {
      //content 是文本内容带标签
      const content = tinymce.get(this.id).getContent();
      // getContent( { 'format' : 'text'} );//这是获取里面的文本文件，不带标签
      return content;
    },
    /**外部调用该方法，可以修改绑定数据*/
    setData(data) {
      tinymce.get(this.id).setContent(data);
    },
    /**外部调用该方法，只读*/
    setReadonly() {
      tinymce.get(this.id).setMode("readonly");
    },
    /**外部调用该方法，可编辑*/
    setDesign() {
      tinymce.get(this.id).setMode("design");
    }
  },
  mounted() {
    //配置的初始化
    tinymce.init(this.init);
  },
  beforeUnmount() {
    if (tinymce.get(this.id) && tinymce.get(this.id).getContent()) {
      this.$emit("beforeUnmount", this.id, tinymce.get(this.id).getContent());
    }
  },
  unmounted() {
    if (tinymce.get(this.id) && tinymce.get(this.id).destroy()) {
      //销毁
      tinymce.get(this.id).destroy();
    }
  },
  watch: {
    tinyVal(val) {
      tinymce.get(this.id).setContent(val); //动态设置内容
    }
  }
};
</script>
<style>
.tinymceDiv {
  width: 100%;
  height: 100%;
}
</style>
