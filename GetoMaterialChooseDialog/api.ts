import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const list = (data?: object) => {
  return http.request<Result>("get", "/api/msp-helper/plm/material/list", {
    params: data
  });
};

export const getCategoryTree = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/plm/material/category-tree",
    {
      params: data
    }
  );
};

export const getCategoryStandardOptions = (data?: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/plm/material/category-standard",
    {
      params: data
    }
  );
};
