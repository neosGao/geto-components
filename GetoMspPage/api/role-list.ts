import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/role-manage/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/role-manage/list",
    {
      data
    }
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/role-manage/export",
    {
      data
    }
  );
};

export const storeRole = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/role-manage/store",
    {
      data
    }
  );
};

export const importRole = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/permission/role-manage/import",
    {
      data
    }
  );
};

export const roleInfo = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/role-manage/info",
    {
      params: data
    }
  );
};

export const editRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/role-manage/edit",
    {
      data
    }
  );
};

export const unableEnableRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/role-manage/unable-enable",
    {
      data
    }
  );
};

export const delRole = (data?: object) => {
  return http.request<Result>(
    "delete",
    "/api/msp-helper/permission/role-manage/del",
    {
      data
    }
  );
};

export const bindUser = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/role-manage/bind-user",
    {
      data
    }
  );
};

export const bindUserConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/role-manage/bind-user-conf",
    {
      params: data
    }
  );
};

export const roleUserList = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/role-manage/role-user-list",
    {
      params: data
    }
  );
};
