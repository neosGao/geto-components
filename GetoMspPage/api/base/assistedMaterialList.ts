import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/assisted-material/conf"
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material/index",
    {
      data
    }
  );
};

// 详情
export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/assisted-material/info",
    {
      params: data
    }
  );
};

export const store = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material/store",
    {
      data
    }
  );
};

export const edit = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/assisted-material/edit",
    {
      data
    }
  );
};

export const deleteList = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/publicbasicdata/assisted-material/delete",
    {
      data
    }
  );
};

export const unable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/assisted-material/disable",
    {
      data
    }
  );
};

export const enable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/assisted-material/enable",
    {
      data
    }
  );
};

export const importList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material/import",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/assisted-material/export",
    {
      data
    }
  );
};

export const sync = (data?: object) => {
    return http.request<Result>(
        "post",
        "/api/msp-helper/publicbasicdata/assisted-material/sync",
        { data }
    );
};
