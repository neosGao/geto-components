import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "api/msp-helper/publicbasicdata/division/conf"
  );
};

export const getList = () => {
  return http.request<Result>(
    "get",
    "api/msp-helper/publicbasicdata/division/index"
  );
};

export const newStoreConf = () => {
  return http.request<Result>(
    "get",
    "api/msp-helper/publicbasicdata/division/store-conf"
  );
};

export const storeDivision = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/division/add",
    {
      data
    }
  );
};

export const editDivision = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/division/edit",
    {
      data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "api/msp-helper/publicbasicdata/division/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "api/msp-helper/publicbasicdata/division/enable",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "api/msp-helper/publicbasicdata/division/export",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
      "post",
      "/api/msp-helper/publicbasicdata/division/sync",
      { data }
  );
};
