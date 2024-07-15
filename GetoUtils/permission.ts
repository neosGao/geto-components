import { getUserPermissionKey } from "@/geto-components/GetoMspPage/api/permission";
import { storageSession } from "@pureadmin/utils";
import { message } from "@/utils/message";

const env = import.meta.env;
const sessionKey = "user-info";

// 表单字段控制
const formItemPermissionSetting = (
  file_permission: object,
  group_key: string,
  config: object
) => {
  const reset_config = [];
  // 字段权限
  const ban_group_fields = file_permission["ban_fields"] ?? [];
  const ban_fields = ban_group_fields[group_key] ?? [];
  const fields_group_config = file_permission["fields_config"] ?? {};
  const fields_config = fields_group_config[group_key] ?? {};

  set(config, ban_fields, fields_config, reset_config);

  return reset_config;
};

const set = (config, ban_fields, fields_config, reset_config) => {
  for (const index in config) {
    const item = config[index];
    // 是否存在字段
    if (ban_fields.indexOf(item.prop) != -1) {
      continue;
    }
    // 设置字段状态
    item.hidden = false;
    item.display = true;
    if (
      fields_config[item.prop] &&
      item.type != "slot" &&
      item.type != "table"
    ) {
      const status = fields_config[item.prop];
      switch (status) {
        case 2:
          item.hidden = true;
          item.display = false;
          break;
        case 3:
          item.disabled = true;
          break;
        case 4:
          item.required = true;
          break;
        default:
          break;
      }
    }

    // 插槽
    if (item.type == "slot" || item.type == "table") {
      for (const i in item.table_data_params) {
        const param = item.table_data_params[i];
        // 是否存在字段
        if (ban_fields.indexOf(param.value) != -1) {
          param.display = false;
        }
        // 设置字段状态
        if (fields_config[param.value]) {
          const status = fields_config[param.value];
          switch (status) {
            case 2:
              param.display = false;
              break;
            case 3:
              param.readonly = true;
              break;
            case 4:
              param.require = true;
              break;
            default:
              break;
          }
        }
      }
    }

    reset_config.push(item);
  }
};

const setFormItemConf = (config, form_config) => {
  for (const index in form_config) {
    const item = form_config[index];
    // 是否存在字段
    if (config[item.prop]) {
      switch (item.type) {
        case "select":
          item.options = config[item.prop];
          break;
        case "radio":
          item.radioOption = config[item.prop];
          break;
        case "checkbox":
          item.checkboxOption = config[item.prop];
          break;
        default:
          break;
      }
    }
    if (item.type == "slot") {
      for (const index in item.table_data_params) {
        const param = item.table_data_params[index];
        if (config[param.value]) {
          param.options = config[param.value];
        }
      }
    }
  }
};

const loadUserPermissionKey = async () => {
  const res: any = await getUserPermissionKey();
  if (res.code != 0) {
    message("获取用户权限失败", { type: "error" });
    return;
  }
  const roles = res.data;

  if (env.VITE_LOGIN_MODE !== "UC") {
    // 非uc登录
    storageSession().setItem(sessionKey, {
      roles
    });
    return;
  }

  const user_info = storageSession().getItem(sessionKey);
  const refresh_token = user_info["refresh_token"];
  const expires = user_info["expires"];
  const username = user_info["username"];
  const is_role_play = user_info["is_role_play"];
  const play_user = user_info["play_user"];
  const can_role_play = user_info["can_role_play"];
  const current_org = user_info["current_org"];
  const org_list = user_info["org_list"];
  const set_data = user_info["set_data"];

  storageSession().setItem(sessionKey, {
    refresh_token,
    expires,
    username,
    roles,
    is_role_play,
    play_user,
    can_role_play,
    current_org,
    org_list,
    set_data
  });
};

export { formItemPermissionSetting, setFormItemConf, loadUserPermissionKey };
