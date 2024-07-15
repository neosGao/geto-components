import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/assisted-material-category/conf"
  );
};

export const getList = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/assisted-material-category/index"
  );
};

export const newStoreConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/division/store-conf"
  );
};

export const storeCategory = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material-category/store",
    {
      data
    }
  );
};

export const editCategory = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/assisted-material-category/edit",
    {
      data
    }
  );
};

export const deleteList = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/publicbasicdata/assisted-material-category/delete",
    { data }
  );
};

export const importList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material-category/import",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material-category/export",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
      "post",
      "/api/msp-helper/publicbasicdata/assisted-material-category/sync",
      { data }
  );
};
