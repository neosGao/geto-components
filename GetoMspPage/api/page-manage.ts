import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/page-manage/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/page-manage/list",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/page-manage/export",
    {
      data
    }
  );
};

export const syncData = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/page-manage/sync",
    {
      data
    }
  );
};

export const bindRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/page-manage/bind-role",
    {
      data
    }
  );
};

export const bindRoleConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/page-manage/bind-role-conf",
    {
      params: data
    }
  );
};
