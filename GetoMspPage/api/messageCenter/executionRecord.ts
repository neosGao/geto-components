import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

// 手动发送
export const manualSend = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/send-log/manual-send",
    {
      data: data
    }
  );
};

// 执行记录列表配置
export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/trigger-log/list-page-conf",
    {
      params: data
    }
  );
};

// 执行记录列表数据
export const list = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/trigger-log/list",
    {
      data: data
    }
  );
};

// 发送记录列表配置
export const getSendListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/send-log/list-page-conf",
    {
      params: data
    }
  );
};

// 发送记录列表数据
export const sendlist = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/message/send-log/list", {
    data: data
  });
};
