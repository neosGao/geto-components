import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: object;
};

export const getListPageConf = () => {
  return http.request<Result>("get", "/getListPageConf");
};

export const getList = () => {
  return http.request("get", "/api/user/user-manage/list-page-conf");
};

export const getTableData = data => {
  return http.request("post", "/api/user/user-manage/list", { data });
};
