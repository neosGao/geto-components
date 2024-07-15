import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/log/operation/list-page-conf",
    {
      params: data
    },
    {
      operate: "配置接口"
    }
  );
};

export const getOperationInfo = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/log/operation/info",
    {
      params: data
    },
    {
      operate: "详情接口"
    }
  );
};
