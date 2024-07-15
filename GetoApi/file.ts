import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getFileUploadStrategy = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/file/strategy", {
    params: data
  });
};

export const getFileUploadSingleStrategy = (
  data?: object,
  headers?: object
) => {
  return http.post(
    "/api/msp-helper/file/single-file-upload",
    {
      data
    },
    { headers }
  );
};

export const fileDetail = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/file/detail", {
    params: data
  });
};

