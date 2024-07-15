import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/bank/conf"
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank/index",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank/export",
    { data }
  );
};
export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank/sync",
    { data }
  );
};
