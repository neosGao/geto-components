import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getModuleMenu = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/sub-menu", {
    params: data
  });
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/list-page-conf", {
    data
  });
};

export const getList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/list", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/menu/export", {
    data
  });
};

export const syncData = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/menu/sync", {
    data
  });
};

export const collect = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/menu/collect", {
    data
  });
};

export const dot = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/menu/dot", {
    params: data
  });
};

export const workbenchCollect = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/menu/workbench-collect",
    {
      data
    }
  );
};
