import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/statement/statics-data/export",
    {
      params: data
    }
  );
};

export const getSideList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/statement/list", {
    params: data
  });
};

export const getSourceList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/statement/data-source-list",
    {
      params: data
    }
  );
};

export const getSourceConfig = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/statement/store-config", {
    params: data
  });
};

export const getChartData = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/statement/statics-data/index",
    {
      data
    }
  );
};

export const getStatementInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/statement/info", {
    params: data
  });
};

export const saveStatementNew = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/statement/store", {
    data
  });
};

export const saveStatementEdit = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/statement/edit", {
    data
  });
};

export const deleteStatement = (data?: object) => {
  return http.request<Result>("delete", "/api/msp-helper/statement/delete", {
    params: data
  });
};

export const fileDetail = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/file/detail", {
    params: data
  });
};

export const setColumn = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/statement/set-column", {
    data
  });
};

export const staticsExport = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/statement/statics-data/export",
    {
      data
    }
  );
};

export const chartsPreview = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/statement/statics-data/preview",
    {
      data
    }
  );
};

export const belong_user = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/statement/user-list", {
    params: data
  });
};

export const orgFunction = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/statement/position-list",
    {
      params: data
    }
  );
};
