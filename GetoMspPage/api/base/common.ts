import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const exportExcelList = (data?: object) => {
  return http.request<Result>("get", "/api/common/task/excel-export-list", {
    params: data
  });
};

export const importExcelList = (data?: object) => {
  return http.request<Result>("get", "/api/common/task/excel-import-list", {
    params: data
  });
};

export const getFileUploadStrategy = (data?: object) => {
  return http.request<Result>("get", "/api/common/file/strategy", {
    params: data
  });
};

export const fileDetail = (data?: object) => {
  return http.request<Result>("get", "/api/common/file/detail", {
    params: data
  });
};

export const taskInfo = (data?: object) => {
  return http.request<Result>("get", "/api/common/task/info", {
    params: data
  });
};

export const taskFail = (data?: object) => {
  return http.request<Result>("put", "/api/common/task/fail", {
    data
  });
};
