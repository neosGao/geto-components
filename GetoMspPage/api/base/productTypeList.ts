import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/product-type/conf");
};

export const productTypeInfo = (params?: object) => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/product-type/detail", {
    params
  });
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/product-type/export", {
    data
  });
};

export const sync = (data?: object) => {
  return http.request<Result>(
      "post",
      "/api/msp-helper/publicbasicdata/product-type/sync",
      {
        data
      }
  );
};

