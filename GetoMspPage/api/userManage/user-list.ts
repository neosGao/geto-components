import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/list-page-conf", {
    params: data
  });
};

export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/list", {
    data
  });
};

export const getInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/info", {
    params: data
  });
};

export const syncList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/sync", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/export", {
    data
  });
};

export const getPosition = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/get-position", {
    data
  });
};

export const bindRoleConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/bind-role-conf", {
    params: data
  });
};

export const bindRole = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/bind-role", {
    data
  });
};
