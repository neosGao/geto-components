import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string | number;
  data: Array<any>;
};

export const getListPageConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/conf"
  );
};

export const exportList = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/tax-rate/export",
    {
      data
    }
  );
};

export const taxRateEdit = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/tax-rate/edit",
    {
      data
    }
  );
};

export const taxRateStore = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/tax-rate/store",
    {
      data
    }
  );
};

export const taxRateEnable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/tax-rate/enable",
    {
      data
    }
  );
};

export const taxRateDisable = (data?: object) => {
  return http.request<Result>(
    "patch",
    "/api/msp-helper/publicbasicdata/tax-rate/disable",
    {
      data
    }
  );
};

export const getTaxSystem = (params: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/get-tax-system",
    {
      params
    }
  );
};

export const getTaxTypes = (params: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/get-tax-types",
    {
      params
    }
  );
};

export const taxRateInfo = (params: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/info",
    { params }
  );
};

export const getStoreConf = () => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/store-conf"
  );
};

export const getMeasureUnit = (params: object) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/publicbasicdata/tax-rate/get-measure-unit",
    {
      params
    }
  );
};

export const sync = (data?: object) => {
  return http.request<Result>(
    "post",
    "/api/msp-helper/publicbasicdata/tax-rate/sync",
    {
      data
    }
  );
};
