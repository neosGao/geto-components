import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/distance-maintain/conf",
    {
      params: data
    }
  );
};

export const getList = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/distance-maintain/list"
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/distance-maintain/export",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/distance-maintain/sync",
    {
      data
    }
  );
};
