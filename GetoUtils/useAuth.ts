/**
 * @description 用于审批流程
 * @author zhangpeng
 */

import { ref, computed, onMounted, onUnmounted } from "vue";
import { http } from "@/utils/http";

interface Result {
  code: string;
  data: any;
  message: string;
}
interface Field {
  key: string;
  name: string;
  status: Status;
  status_name?: string;
}
interface ValidateResult {
  success: boolean;
  msg: string;
}

interface Field {
  key: string;
  name: string;
  status: Status;
  status_name?: string;
}
interface IframeData {
  type: string;
  field?: Field[];
  source_main_code?: string;
  flow_main_code?: string;
}
type GetSubmitDataFunc = () => any;

enum Status {
  readonly = 1,
  hide = 2,
  isEdit = 3,
  required = 4
}

type FieldAttribute = {
  show: boolean;
  required: boolean;
  disabled: boolean;
};

function businessFormEdit(data: any): Promise<Result> {
  return http.request(
    "put",
    "/api/msp-helper/approvalflow/business-form/edit",
    {
      data
    }
  );
}

function businessFormChange(data: any): Promise<Result> {
  return http.request(
    "put",
    "/api/msp-helper/approvalflow/business-form/change",
    {
      data
    }
  );
}

/**
 * @description 用于审批流程
 * @param {Function} getSubmitData 获取提交数据
 */
export const useAuth = (getSubmitDataFunc: GetSubmitDataFunc) => {
  const fieldsConfigMap = ref<Map<string, Field>>(new Map());

  const fieldAttribute = computed(() => {
    return (field: string): FieldAttribute => {
      const item = fieldsConfigMap.value.get(field);
      if (item) {
        const { status } = item;
        return {
          show: status !== Status.hide,
          required: status === Status.required,
          disabled:
            status === Status.readonly ||
            (status !== Status.isEdit && status !== Status.required)
        };
      }
      return {
        show: true,
        required: false,
        disabled: true
      };
    };
  });

  const handleMessage = async (event: MessageEvent) => {
    const iframeData: IframeData = event.data;
    console.log("iframeData", iframeData);
    switch (iframeData.type) {
      case "field":
        if (Array.isArray(iframeData.field) && iframeData.field.length) {
          fieldsConfigMap.value = new Map(
            iframeData.field.map(item => [item.key, item])
          );
          // const data = [
          //   {
          //     key: "file",
          //     name: "文员上传文件",
          //     status: 1,
          //     status_name: "只读"
          //   }
          // ];
          // fieldsConfigMap.value = new Map(data.map(item => [item.key, item]));
        }
        break;
      case "submit": {
        if (!getSubmitDataFunc) {
          sendErrorMsg("请传入获取提交数据的方法", iframeData.type);
          return;
        }
        const data =await getSubmitDataFunc();
        const validateResult = validate(data);
        if (!validateResult.success) {
          sendErrorMsg(validateResult.msg, iframeData.type);
          return;
        }

        const params = {
          source_main_code: iframeData.source_main_code,
          flow_main_code: iframeData.flow_main_code,
          data
        };
        console.log("监听接口参数params", params);
        const res = await businessFormEdit(params);
        if (res.code == "0") {
          postMessage({ type: "submit", submit: true, data: data });
        } else {
          sendErrorMsg(res.message, iframeData.type);
        }
        break;
      }
      case "change_data": {
        if (!getSubmitDataFunc) {
          sendErrorMsg("请传入获取提交数据的方法", iframeData.type);
          return;
        }
        const data = getSubmitDataFunc();

        const validateResult = validate(data);
        if (!validateResult.success) {
          sendErrorMsg(validateResult.msg, iframeData.type);
          return;
        }

        const params = {
          source_main_code: iframeData.source_main_code,
          flow_main_code: iframeData.flow_main_code,
          data
        };
        const res = await businessFormChange(params);
        if (res.code == "0") {
          postMessage({ type: "change_data", change_data: true, data: data });
        } else {
          sendErrorMsg(res.message, iframeData.type);
        }
        break;
      }
    }
  };

  /**
   * @description 校验数据
   * @param {Object} data
   * @param {String} prefix 前缀 普通key，数组key.*.key 对象key.key
   */
  const validate = (data: any, prefix?: string): ValidateResult => {
    const result: ValidateResult = {
      success: true,
      msg: ""
    };

    Object.keys(data).some(key => {
      const item = data[key];
      if (Array.isArray(item)) {
        return item.some((i, index) => {
          const { success, msg } = validate(i, `${key}.${index}.`);
          if (!success) {
            Object.assign(result, { success, msg });
            return true;
          }
          return false;
        });
      } else if (Object.prototype.toString.call(item) === "[object Object]") {
        return Object.keys(item).some(i => {
          const { success, msg } = validate(item[i], `${key}.`);
          if (!success) {
            Object.assign(result, { success, msg });
            return true;
          }
          return false;
        });
      } else {
        key = prefix ? `${prefix}${key}` : key;
        const isRequired = fieldAttribute.value(key).required;
        if (isRequired && !item) {
          const name = fieldsConfigMap.value.get(key)?.name;
          result.success = false;
          result.msg = `${name} 不能为空`;
          return true;
        }
        return false;
      }
    });

    return result;
  };

  const postMessage = (msg: any) => {
    window.parent.postMessage(msg, "*");
  };

  const sendErrorMsg = (msg: string, type: string) => {
    postMessage({
      type: type,
      [type]: false,
      msg: msg,
      msgType: "error"
    });
  };

  onMounted(() => {
    window.addEventListener("message", handleMessage, false);
    postMessage({ type: "field" });
  });

  onUnmounted(() => {
    window.removeEventListener("message", handleMessage, false);
  });

  return {
    fieldAttribute
  };
};
