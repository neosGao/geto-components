import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const bindPermissionConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/resource-permission/bind-permission-conf",
    {
      params: data
    }
  );
};

export const bindPermission = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/resource-permission/bind-permission",
    {
      data
    }
  );
};

export const copyToOrg = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/resource-permission/copy-to-org",
    {
      data
    }
  );
};

export const copyToRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/resource-permission/copy-to-role",
    {
      data
    }
  );
};
