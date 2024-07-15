import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/list-manage/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/list-manage/list",
    {
      params: data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/list-manage/export",
    {
      data
    }
  );
};

export const syncData = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/list-manage/sync",
    {
      data
    }
  );
};

export const bindRoleDataPermissionConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/list-manage/bind-role-data-permission-conf",
    {
      params: data
    }
  );
};

export const bindRoleDataPermission = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/list-manage/bind-role-data-permission",
    { data }
  );
};
