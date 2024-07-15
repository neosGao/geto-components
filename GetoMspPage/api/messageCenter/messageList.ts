import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

//  详情
export const info = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/info",
    {
      params: data
    }
  );
};
// 标记已读
export const read = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/user-message/read",
    {
      data: data
    }
  );
};
// 列表配置
export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/message/user-message/list-page-conf",
    {
      params: data
    }
  );
};

export const list = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/message/user-message/list",
    {
      data: data
    }
  );
};
