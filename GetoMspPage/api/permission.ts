import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getUserPermissionKey = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/permission/user/permission-key",
    {
      params: data
    }
  );
};
