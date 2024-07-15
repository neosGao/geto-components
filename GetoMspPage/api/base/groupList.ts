import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/group/conf"
  );
};

export const newStoreConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/group/store-form-conf",
    {
      params: data
    }
  );
};

export const storeGruop = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/add",
    {
      data
    }
  );
};

export const editGroup = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/edit",
    {
      data
    }
  );
};

export const infoGroup = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/group/detail",
    {
      params: data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/enable",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/export",
    {
      data
    }
  );
};

export const importList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/group/import",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
    return http.request<Result>(
        "post",
        "/api/msp-helper/publicbasicdata/group/sync",
        {
            data
        }
    );
};
