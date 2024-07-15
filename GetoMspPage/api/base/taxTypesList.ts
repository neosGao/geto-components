import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-types/conf");
};

export const exportList = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/tax-types/export", {
    data
  });
};

export const taxTypesEdit = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-types/edit", {
    data
  });
};

export const taxTypesStore = (data?: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/tax-types/store", {
    data
  });
};

export const taxTypesEnable = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-types/enable", {
    data
  });
};

export const taxTypesDisable = (data?: object) => {
  return http.request<Result>("patch", "/api/msp-helper/publicbasicdata/tax-types/disable", {
    data
  });
};

export const getStoreConf = () => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-types/store-conf");
};

export const getTaxSystem = (params: object) => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-types/get-tax-system", {
    params
  });
};

export const taxSystemInfo = (params: object) => {
  return http.request<Result>("get", "/api/msp-helper/publicbasicdata/tax-types/info", { params });
};

export const sync = (params: object) => {
  return http.request<Result>("post", "/api/msp-helper/publicbasicdata/tax-types/sync", { params });
};
