import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const viewSave = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/view/save", { data });
};

export const viewReset = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/view/reset", { data });
};

export const viewDelete = (data?: object) => {
  return http.request<Result>("delete", "/api/msp-helper/view/del", { data });
};

export const viewEdit = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/view/edit", { data });
};
