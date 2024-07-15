import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getListPageConf = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/workbench/my-task/list-page-conf",
    {
      params: data
    }
  );
};

export const getList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/workbench/my-task/list", {
    params: data
  });
};

export const ignore = (data?: object) => {
  return http.request<Result>(
    "put",
    "/api/msp-helper/workbench/my-task/ignore",
    {
      data
    }
  );
};

export const goToDo = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/workbench/my-task/go-to-do",
    {
      params: data
    }
  );
};
