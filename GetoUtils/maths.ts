export const toFixedFormat = num => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// 字符串过滤，只保留小写字母
export const filterLowerCase = (str: string) => {
  return str.replace(/[^a-z]/g, "");
};

// 变量处理
export const handleVariable = (data: string[]) => {
  const dataStr = filterLowerCase(data.join(""));
  const newData = [...new Set(dataStr)];
  return newData;
};
