import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const formFiledPermissionConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/form-field-permission/form-field-permission-conf",
    {
      params: data
    }
  );
};

export const formFiledPermission = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/form-field-permission/form-field-permission",
    {
      data
    }
  );
};

export const copyToOrg = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/form-field-permission/copy-to-org",
    {
      data
    }
  );
};

export const copyToRole = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/permission/form-field-permission/copy-to-role",
    {
      data
    }
  );
};
