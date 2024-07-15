import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/country-work-time/conf"
  );
};

export const newStoreConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/country-work-time/store-form-conf",
    {
      params: data
    }
  );
};

export const store = (data?: object) => {
  return http.request<Result>(
    "post",
    "/aapi/msp-helper/publicbasicdata/country-work-time/store",
    {
      data
    }
  );
};

export const edit = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country-work-time/edit",
    {
      data
    }
  );
};

export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/country-work-time/detail",
    {
      params: data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country-work-time/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country-work-time/enable",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country-work-time/export",
    { data }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/country-work-time/sync",
    { data }
  );
}
