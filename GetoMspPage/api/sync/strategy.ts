import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/sync/strategy/list-page-conf",
    {
      params: data
    }
  );
};
export const getList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/strategy/list", {
    data
  });
};

export const detail = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/sync/strategy/info", {
    params: data
  });
};
export const storeConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/sync/strategy/store-conf",
    {
      params: data
    }
  );
};

export const store = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/strategy/store", {
    data
  });
};

export const edit = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/sync/strategy/edit", {
    data
  });
};

export const getField = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/sync/strategy/field", {
    params: data
  });
};

export const getTable = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/sync/strategy/table", {
    params: data
  });
};

export const getDb = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/sync/strategy/db", {
    params: data
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/strategy/export", {
    data
  });
};

export const enable = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/strategy/enable", {
    data
  });
};

export const disable = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/sync/strategy/disable", {
    data
  });
};

export const del = (data?: object) => {
  return http.request<Result>("delete", "/api/msp-helper/sync/strategy/del", {
    data
  });
};
export const inc = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/sync/strategy/manual-inc",
    {
      data
    }
  );
};
