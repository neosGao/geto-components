import { http } from "@/utils/http";

type Result = {
  message: string;
  data: any;
  code: string;
};

export const fieldExport = data => {
  return http.request<Result>("post", "/api/msp-helper/fieldandform/field-config/export", {
    data
  });
};

export const conf = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/field-config/operate-conf");
};

export const list = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/field-config/index");
};

export const listConf = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/field-config/index-conf");
};

export const fieldAdd = (data: any) => {
  return http.request<Result>("post", "/api/msp-helper/fieldandform/field-config/store", {
    data
  });
};

export const fieldEdit = (data: any) => {
  return http.request<Result>("patch", "/api/msp-helper/fieldandform/field-config/update", {
    data
  });
};

export const fieldDelete = (data: any) => {
  return http.request<Result>("delete", "/api/msp-helper/fieldandform/field-config/delete", {
    data
  });
};

export const fieldChangeStatus = (data: any) => {
  return http.request<Result>("patch", "/api/msp-helper/fieldandform/field-config/switch", {
    data
  });
};

export const formConf = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/form-config/index-conf");
};

export const formModulesConf = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/module-config/index-conf");
};

export const formModulesAdd = data => {
  return http.request<Result>("post", "/api/msp-helper/fieldandform/module-config/store", {
    data
  });
};
export const formModulesEdit = data => {
  return http.request<Result>("patch", "/api/msp-helper/fieldandform/module-config/update", {
    data
  });
};

export const formModulesDelete = data => {
  return http.request<Result>("delete", "/api/msp-helper/fieldandform/module-config/delete", {
    data
  });
};

export const formModulesChangeStatus = (data: any) => {
  return http.request<Result>("patch", "/api/msp-helper/fieldandform/module-config/switch", {
    data
  });
};

export const moduleList = () => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/form-config/get-module-list");
};

export const fieldOptionList = (params: any) => {
  return http.request<Result>(
    "get",
    "/api/msp-helper/fieldandform/form-config/get-field-option-list",
    {
      params
    }
  );
};

export const formConfigStore = data => {
  return http.request<Result>("post", "/api/msp-helper/fieldandform/form-config/store", { data });
};

export const formConfigUpdate = data => {
  return http.request<Result>("patch", "/api/msp-helper/fieldandform/form-config/update", { data });
};
export const fieldSelectList = params => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/form-config/get-field-by-name", {
    params
  });
};

export const formInfo = params => {
  return http.request<Result>("get", "/api/msp-helper/fieldandform/form-config/info", { params });
};
