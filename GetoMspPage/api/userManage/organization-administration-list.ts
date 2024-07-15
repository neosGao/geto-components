import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return  http.request<Result>("get", "/api/msp-helper/user/organization-administration/list-page-conf", {
    params: data
  })
}

export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/organization-administration/list", {
    data
  });
};

export const getInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/organization-administration/info", {
    params: data
  });
};

export const syncList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/organization-administration/sync", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/user/organization-administration/export", {
    data
  });
};
