import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/sync/log/list-page-conf",
    {
      params: data
    }
  );
};
export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/log/list", {
    data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/log/export", {
    params: data
  });
};
