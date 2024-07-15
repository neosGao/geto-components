import { http } from "@/utils/http";

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
