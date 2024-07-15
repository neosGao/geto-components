import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/user-type/list-page-conf", {
    params: data
  });
};
export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/user-type/list", {
    data
  });
};

export const getInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/user-type/info", {
    params: data
  });
};

export const syncList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/user-type/sync", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/user-type/export", {
    data
  });
};
