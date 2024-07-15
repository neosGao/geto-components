import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

// 埋点 新增
export const create = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/create",
    {
      data: data
    },
    {
      oprate: "新增"
    }
  );
};
// 埋点 详情
export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/tracking-point/info",
    {
      params: data
    },
    {
      oprate: "详情"
    }
  );
};

export const edit = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/edit",
    {
      data: data
    }
  );
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/tracking-point/list-page-conf",
    {
      params: data
    }
  );
};

export const list = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/list",
    {
      data: data
    }
  );
};
