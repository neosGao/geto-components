import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

// 获取分组数据(树)
export const getTree = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/measure-unit/group/index",
    {
      params: data
    }
  );
};
export const storeGruop = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/group/store",
    {
      data
    }
  );
};

export const editGroup = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/measure-unit/group/edit",
    {
      data
    }
  );
};

export const deleteGroup = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/publicbasicdata/measure-unit/group/delete",
    {
      data
    }
  );
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/measure-unit/conf"
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/index",
    {
      data
    }
  );
};

export const getStoreConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/measure-unit/storeConf"
  );
};

export const storeUnit = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/store",
    {
      data
    }
  );
};

export const editUnit = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/measure-unit/edit",
    {
      data
    }
  );
};

export const infoUnit = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/measure-unit/info",
    {
      params: data
    }
  );
};

export const deleteList = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/publicbasicdata/measure-unit/delete",
    {
      data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/measure-unit/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/measure-unit/enable",
    {
      data
    }
  );
};

export const importList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/import",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/export",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/sync",
    {
      data
    }
  );
};

export const syncGroup = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/measure-unit/sync-group",
    {
      data
    }
  );
};
