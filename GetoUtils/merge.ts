/*
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-02 10:12:55
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2024-05-06 17:37:10
 * @FilePath: \scm-web\src\geto-components\GetoUtils\merge.ts
 * @Description:
 *
 * Copyright (c) gwj, All Rights Reserved.
 */
/**
 * @author: Junxu
 * @description:
 * @param {Array} fields 需要根据哪些字段名合并的字符串数组
 * @param {Array} data 列表数据
 * @return {*}
 */
export const spanRules = (
  fields: Array<string>,
  data: Array<any>
): Array<number> => {
  const rules: Array<number> = [];
  let contactDot = 0;
  if (data && data.length > 0) {
    data.forEach((item, index) => {
      if (index === 0) {
        rules.push(1);
      } else {
        const preItem = data[index - 1]; // 前一行
        if (fields.length === 1) {
          // 不存在父合并约束
          // 非空校验 0除外
          if (
            item[fields[0]] !== null &&
            item[fields[0]] !== undefined &&
            item[fields[0]] === preItem[fields[0]]
          ) {
            rules[contactDot] += 1;
            rules.push(0);
          } else {
            contactDot = index;
            rules.push(1);
          }
        } else if (fields.length > 1) {
          // 存在父合并约束
          const flag = fields.reduce(
            (obj, cur) => obj && item[cur] === preItem[cur],
            true
          );
          if (flag) {
            rules[contactDot] += 1;
            rules.push(0);
          } else {
            contactDot = index;
            rules.push(1);
          }
        }
      }
    });
  }
  return rules;
};

//获得数据相同的行数
export function rowspan(tableData, key = "pid") {
  //每次调用清空数据
  this.spanArr = [];
  this.position = 0;
  tableData.forEach((item, index) => {
    if (index === 0) {
      this.spanArr.push(1);
      this.position = 0;
    } else {
      if (tableData[index][key] === tableData[index - 1][key]) {
        this.spanArr[this.position] += 1;
        this.spanArr.push(0);
      } else {
        this.spanArr.push(1);
        this.position = index;
      }
    }
  });
}
