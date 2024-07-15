import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/company-manage/conf",
    {
      params: data
    }
  );
};

export const getList = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/company-manage/list"
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/company-manage/export",
    {
      data
    }
  );
};

export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/company-manage/info",
    {
      params: data
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/company-manage/sync",
    {
      data
    }
  );
};
