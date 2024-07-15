import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};
// 创建互动key
export const storeInteract = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/crosssysteminteract/store-interact",
    {
      data
    }
  );
};
// 停止互动
export const stopInteract = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/crosssysteminteract/stop-interact",
    {
      data
    }
  );
};
// 获取互动状态
export const getInteract = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/crosssysteminteract/get-interact",
    {
      params: data
    }
  );
};
