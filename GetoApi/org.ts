import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const setOrg = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/user/user-business-org-switch",
    {
      data
    }
  );
};
