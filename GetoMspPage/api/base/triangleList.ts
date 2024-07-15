import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/triangle/conf"
  );
};

export const newStoreConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/triangle/store-form-conf",
    {
      params: data
    }
  );
};

export const storeTriangle = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/store",
    {
      data
    }
  );
};

export const editTriangle = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/update",
    {
      data
    }
  );
};

export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/triangle/detail",
    {
      params: data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/enable",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/export",
    {
      data
    }
  );
};
export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/triangle/sync",
    {
      data
    }
  );
};
