<template>
  <div :style="divStyle">
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      :file-status-text="fileStatusText"
      @file-added="onFileAdded"
      @file-error="onFileError"
    >
      <uploader-unsupport />
      <!-- 是否允许拖拽 -->
      <uploader-drop v-if="configs.isDrop">
        将文件拖到此处，或<em>点击上传</em>
        <uploader-btn
          :attrs="{ accept: configs.accept }"
          :style="configs.button.style"
          :class="configs.button.icon"
          >{{ configs.button.name }}</uploader-btn
        >
      </uploader-drop>
      <uploader-btn
        v-else
        :attrs="{ accept: configs.accept }"
        :style="configs.button.style"
        :class="configs.button.icon"
        class="el-button"
        v-loading="loading"
        v-show="!uploadDisabled"
      >
        {{ configs.button.name }}</uploader-btn
      >
      <uploader-list v-if="configs.isShowList">
        <template v-slot:default="scope">
          {{ scope }}
        </template>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import FileService from "./components/fileService/index.js";
// import { get_current_user } from "@/api/common";
export default {
  name: "GetoUploadFile",
  props: {
    configs: {
      type: Object,
      default: function () {
        return {
          accept: [],
          button: {
            name: "选择文件"
          }
        };
      }
    },
    divStyle: {
      type: Object,
      default: () => ({})
    },
    uploadDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      options: {
        allowDuplicateUploads: false, // 一个文件以及上传过了是否还允许再次上传
        target: "", //上传地址，如果有文件上传地址不同时 可以是个函数来改变
        chunkSize: "2048000",
        simultaneousUploads: 3,
        // query: (file, chunk) => {
        //   //上传时所带的参数 可以是个函数在选择文件时 自定义（拿到的两个参数分别是Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式）
        //   return {
        //       ...file.params,
        //       isUseLastVersionFieldValueWhenUpdate: false, // 请带false
        //       path: CreateFilePath(file.relativePath, true),
        //       autoIdNamingType: "Auto", // 自动编码
        //       directoryId: 14, // 项目ID
        //   };
        // },
        testChunks: false //测试每个块是否在服务端已经上传了
      }
    };
  },
  computed: {
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  methods: {
    //值得注意的是我这个方法是@files-added="onFilesAdded"，是对当前一次性上传的所有文件做的处理，比如说上传5个文件 那就是会获得一个数组里面包括5个文件，这个函数是在file-added全部执行完后走一次
    // @file-added="onFileAdded"获取到的单个当前上传文件，按照上传顺序来的，比如说上传5个文件，那这个函数会执行5次
    // 全部文件处理
    async onFileAdded(fileObj, fileList, event) {
      this.loading = true;
      this.$emit("added", fileObj, fileList, event);
      fileObj.pause();
      const { file } = fileObj;
      if (fileObj.ignored) return;
      try {
        const fileService = new FileService();
        const { success } = await fileService.startUploadSingleFile(file);
        if (!success) {
          fileObj.cancel(); // 取消上传
          this.$emit("error", { code: 404, message: `${file.name}上传失败` });
          return;
        }
        const fileInfo = fileService.getFileInfo();

        if (process.env.NODE_ENV == "development") {
          this.getUploadUserInfo(fileInfo, fileObj, "dev");
        } else {
          this.handeleUploadFileSuccess(fileInfo, fileObj, "product");
        }
      } catch (error) {
        fileObj.cancel();
        this.uploader._trigger("fileError");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    getUploadUserInfo(fileInfo, fileObj, type) {
      // 获取用户信息后的操作
      // get_current_user().then(response => {
      //   this.handeleUploadFileSuccess(fileInfo, fileObj, type, response.data);
      // });
      this.handeleUploadFileSuccess(fileInfo, fileObj, type);
    },

    handeleUploadFileSuccess(file, fileObj, type, info = {}) {
      let fileItem = {};
      this.loading = true;
      if (type == "dev") {
        fileItem = {
          file_id: file.fileID,
          file_name: file.name,
          file_size: file.size / 1024 / 1024,
          create_user: info.name,
          create_user_id: info.id,
          create_user_name: info.name,
          create_time: this.getCurrentTime(),
          file_status: "已成功",
          download:file.download
          // uniqueIdentifier: file.uniqueIdentifier
        };
      } else {
        const userInfo = JSON.parse(sessionStorage["user-info"]);
        const createUser = userInfo.name;
        fileItem = {
          file_id: file.fileID,
          file_name: file.name,
          file_size: file.size / 1024 / 1024,
          create_user: createUser,
          create_user_id: userInfo.id,
          create_user_name: createUser,
          create_time: this.getCurrentTime(),
          file_status: "已成功",
          download:file.download
          // uniqueIdentifier: file.uniqueIdentifier
        };
      }
      this.$emit(
        "success",
        { code: 200, data: { ...file, fileId: file.fileID } },
        fileItem
      );
      fileObj.cancel();
      fileObj.completed = true;
      fileObj.resume();
      setTimeout(() => {
        this.loading = false;
        this.loaded = 100; // 返回文件信息才算上传完成
      }, 1000);
    },
    // 文件上传失败
    onFileError(file) {
      this.$emit("error", file);
      this.loading = false;
      this.$message({
        message: "上传失败，请重试！",
        type: "error"
      });
    },

    // 过程显示码
    fileStatusText(status) {
      const statusTextMap = {
        uploading: "上传中",
        paused: "停止",
        waiting: "等待上传",
        success: "成功",
        error: "失败"
      };
      return statusTextMap[status];
    },

    // 获取当前时间（年月日时分秒）
    getCurrentTime() {
      const time = new Date();
      // console.log(time)
      const year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hour = time.getHours();
      let minute = time.getMinutes();
      let second = time.getSeconds();

      if (month < 10) {
        month = `0${month}`;
      }
      if (date < 10) {
        date = `0${date}`;
      }
      if (hour < 10) {
        hour = `0${hour}`;
      }
      if (minute < 10) {
        minute = `0${minute}`;
      }
      if (second < 10) {
        second = `0${second}`;
      }
      // console.log(year, month, date, hour, minute, second)
      const formatTime = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
      return formatTime;
    }
  }
};
</script>

<style lang="scss">
.uploader-example {
  /* width: 880px; */
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
