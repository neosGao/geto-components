import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

// 埋点列表
export const create = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/create",
    {
      data: data
    }
  );
};

// 编辑埋点
export const edit = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/edit",
    {
      data: data
    }
  );
};

// 删除埋点
export const del = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/message/tracking-point/delete",
    {
      data: data
    }
  );
};
//  详情
export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/tracking-point/info",
    {
      params: data
    }
  );
};

// 设置埋点状态
export const setStatus = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/set-status",
    {
      data: data
    }
  );
};

// 所属模块 配置
export const menuTree = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/tree", {
    params: data
  });
};

// 列表配置
export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/tracking-point/list-page-conf",
    {
      params: data
    }
  );
};

// 埋点列表
export const list = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/tracking-point/list",
    {
      data: data
    }
  );
};
