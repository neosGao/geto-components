import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const searchRemoteMethod = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/search/remote-method", {
    params: data
  });
};
