import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAppList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/user/internal/app-list", {
    data
  });
};
