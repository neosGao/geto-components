import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/bank-rate/conf"
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank-rate/export",
    { data }
  );
};

export const rateEdit = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/bank-rate/edit",
    {
      data
    }
  );
};

export const rateStore = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank-rate/store",
    {
      data
    }
  );
};
export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/bank-rate/sync",
    {
      data
    }
  );
};
