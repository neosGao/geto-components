import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-system/conf");
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/tax-system/export", {
    data
  });
};

export const taxSystemEdit = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-system/edit", {
    data
  });
};

export const taxSystemStore = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/tax-system/store", {
    data
  });
};

export const taxSystemEnable = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-system/enable", {
    data
  });
};

export const taxSystemDisable = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-system/disable", {
    data
  });
};

export const getCountry = (params: object) => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-system/get-country", {
    params
  });
};

export const taxSystemInfo = (params: object) => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-system/info", { params });
};

export const sync = (data?: object) => {
  return http.request<Result>(
      "post",
      "/api/msp-helper/publicbasicdata/tax-system/sync",
      {
        data
      }
  );
};
