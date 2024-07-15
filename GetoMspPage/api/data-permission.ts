import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const bindDataPermissionConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/data-permission/bind-data-permission-conf",
    {
      params: data
    }
  );
};

export const bindDataPermission = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/data-permission/bind-data-permission",
    {
      data
    }
  );
};

export const copyToOrg = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/data-permission/copy-to-org",
    {
      data
    }
  );
};

export const copyToRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/data-permission/copy-to-role",
    {
      data
    }
  );
};
