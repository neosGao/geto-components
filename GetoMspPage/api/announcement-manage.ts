import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/announcement/system-announcement/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/announcement/system-announcement/list",
    {
      params: data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/announcement/system-announcement/export",
    {
      data
    }
  );
};

export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/announcement/system-announcement/info",
    {
      params: data
    }
  );
};

export const syncData = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/announcement/system-announcement/sync",
    {
      data
    }
  );
};
