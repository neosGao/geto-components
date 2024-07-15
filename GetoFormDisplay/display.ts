import { http } from "@/utils/http";
import { OptionsFieldInfo } from "./config";

type Result = {
  message: string;
  data: any;
  code: string;
};

export const getSelectOptions = (url, params) => {
  return http.request<Result>("get", url, { params });
};

export const getRemoteOptions = async (value, remote) => {
  const { data, code } = await getSelectOptions(remote.method, {
    [remote.param]: value
  });
  return code === "0" ? data : [];
};

export const isContains = (a: (string | number)[], b: (string | number)[]) => {
  return b.every(i => a.includes(i));
};

/**
 * @description 绑定关系处理
 * @param relations 关系
 * @param data 数据
 * @param dataFn 数据函数
 */
export const bindRelation = (relations: OptionsFieldInfo[], data: any, dataFn?: Function) => {
  if (!relations || !relations.length) return true;
  const wheres = [];
  let index = 0;
  for (const rela of relations) {
    data = dataFn ? dataFn(rela, data) : data; // 特殊处理表单跨模块取值
    let value = data[rela.table_field ?? rela.field_name];
    let where = false;
    if (rela.choose_value_type === 1) {
      where = rela.choose_value.includes(value as never);
    } else {
      value = Array.isArray(value) ? value : [value];
      where = isContains(rela.choose_value, value || []);
    }
    const relation = rela.connection_relation === "and" ? "&&" : "||";
    const isLastIndex = index === relations.length - 1;

    // const left = rela.left_parenthesis.slice(0, -1);
    // const right = rela.right_parenthesis.slice(0, -1);

    wheres.push(
      `${rela.left_parenthesis}${where}${rela.right_parenthesis}${!isLastIndex ? relation : ""}`
    );
    index += 1;
  }

  try {
    const fn = new Function(`return ${wheres.join("")}`);
    return fn();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(relations, "Invalid JavaScript code:", wheres.join(""));
    } else {
      throw error;
    }
  }
};
