import axios from "axios";
import funcMoudle from "./actionFunc/index";
import cyptos from "./utils/cyptoSha1";
import { getTokenStr } from "@/utils/auth";
import { http } from "@/utils/http";
import { message as messageBox, closeAllMessage } from "@/utils/message";

class FileService {
  constructor(token) {
    this.steps = [];
    this.action = [];
    this.fileInfo = null;
    this.uploadFuc = null;
    this.token = token || getTokenStr();
  }

  initAction() {
    this.action = this.steps.reduce(
      (source, { action }) => [
        ...source,
        ...(Array.isArray(action)
          ? action
          : Object.getPrototypeOf(action) === Object.prototype
          ? Object.values(action)
          : [])
      ],
      []
    );
  }

  async startUploadMultipleFile(fileList = []) {
    const successFile = [];
    const errorFile = [];
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      const res = await this.startUploadSingleFile(file);
      if (res.success) {
        successFile.push(this.getFileInfo());
      } else {
        errorFile.push(file.name);
      }
    }
    this.fileInfo = null;
    return {
      success: errorFile.length === 0,
      data: {
        successFile,
        errorFile
      },
      message:
        errorFile.length === 0 ? "上传成功" : `上传${errorFile.join(",")}失败`
    };
  }

  async startUploadSingleFile(file) {
    const { type, message } = await this.initSteps(file);
    if (type === "error") {
      return {
        success: false,
        message
      };
    }
    if (type === "success") {
      return {
        success: true
      };
    }

    return await this.startUpload(file);
  }

  async initSteps(file) {
    try {
      const res = await this.handelHasFile(file);
      if (res.type === "error") {
        closeAllMessage();
        messageBox(res.message, { type: "error" });
        return res;
      }
      if (res.type === "success") {
        closeAllMessage();
        this.fileInfo = res.data || {};
      } else {
        const { provider } = res.data;
        if (!Object.prototype.hasOwnProperty.call(funcMoudle, provider)) {
          closeAllMessage();
          throw new Error(`没有${provider}.js文件`);
        }
        const Moudle = funcMoudle[provider];
        this.uploadFuc = new Moudle();
        this.steps = res.data.steps || [];
        this.initAction();
      }
      return res;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async startUpload(file) {
    this.fileInfo = {};
    if (this.uploadFuc.reset) {
      this.uploadFuc.reset();
    }
    try {
      let num = 0;
      for (let i = 0; i < this.action.length; i++) {
        const item = this.action[i];
        const { success } = await this.creatAxios(item, file);
        if (success) {
          num++;
        } else {
          break;
        }
      }
      if (num === this.action.length) {
        closeAllMessage();
        return {
          success: true
        };
      } else {
        return {
          success: false,
          message: "上传失败"
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  getFileInfo() {
    return this.fileInfo || {};
  }

  async handelFiletoSha1(file) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return new Promise(function (resolve, reject) {
      fileReader.onload = function (e) {
        resolve(cyptos(new Uint8Array(e.target.result)));
      };

      fileReader.onerror = reject;
    });
  }

  async handelHasFile(file) {
    const message = {
      type: "success",
      message: "",
      data: null
    };
    const sha1 = await this.handelFiletoSha1(file);
    const { name, type, size } = file;
    const data = {
      hash: `${sha1}`,
      extension: name.substring(name.lastIndexOf(".") + 1),
      fileName: name,
      mimeType: type,
      // ruleID: "1",
      size
    };
    // 设置登录用户
    const env = import.meta.env;
    const mode = env.MODE;
    const headers = {
      token: this.token,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    };
    if (mode == "development") {
      headers["X-User-Id"] = 1; // 37
    } else {
      headers["Authorization"] = "Bearer " + getTokenStr();
    }
    // const response = await axios({
    //   method: "POST",
    //   headers: headers,
    //   data,
    //   url: env.VITE_API_PROXY_HOST + "/api/common/file/strategy"
    // });
    messageBox("正在上传...", { type: "warning", duration: 0 });
    try {
      const response = await http.post(
        "/api/msp-helper/file/strategy",
        { data },
        { headers }
      );
      if (response.code === "0") {
        if (response.data.fileInfo) {
          message.type = "success";
          message.data = response.data.fileInfo;
        } else {
          message.type = "upload";
          message.data = response.data;
        }
      } else {
        message.type = "error";
        message.message = response.message;
      }
    } catch (error) {
      message.type = "error";
      message.message = "上传失败";
      closeAllMessage();
    }
    return message;
  }

  async sendRequest(func = "", parms = {}) {
    try {
      if (!this.uploadFuc[func]) {
        return;
      }
      const res = await this.uploadFuc[func](parms);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async creatAxios(item = {}, file) {
    const { url, method } = item;
    const returnValue = {
      success: false
    };
    let data = {
      isSendRequst: !item["before-request"],
      axiosConfig: {
        url,
        method
      }
    };
    if (item["before-request"]) {
      const res = await this.sendRequest(item["before-request"], {
        item,
        file
      });
      if (res) {
        data = res;
      }
    }
    if (data.isSendRequst) {
      try {
        const res = await axios(data.axiosConfig);
        if (res.status === 200) {
          let afterData = null;
          if (item["after-request"]) {
            afterData = await this.sendRequest(item["after-request"], {
              response: res,
              item,
              file
            });
          }
          returnValue.success = true;
          if (afterData) {
            this.fileInfo = afterData.fileInfo || null;
            returnValue.success = afterData.success;
          }
        }
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    } else {
      if (data.isNextSetp) {
        returnValue.success = true;
      }
    }

    return returnValue;
  }
}

export default FileService;
