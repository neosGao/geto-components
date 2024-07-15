import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/country/conf"
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country/index",
    { data }
  );
};

export const newStoreConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/country/store-conf"
  );
};

export const newStore = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country/store",
    { data }
  );
};

export const editStore = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/country/edit",
    { data }
  );
};

export const deleteList = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/publicbasicdata/country/delete",
    { data }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country/export",
    { data }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country/sync",
    { data }
  );
};
