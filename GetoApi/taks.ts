import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const exportExcelList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/task/excel-export-list", {
    params: data
  });
};

export const importExcelList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/task/excel-import-list", {
    params: data
  });
};

export const taskInfo = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/task/info", {
    params: data
  });
};

export const taskFail = (data?: object) => {
  return http.request<Result>("put", "/api/msp-helper/task/fail", {
    data
  });
};

export const getTaskList = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/task/list", {
    params: data
  });
};
