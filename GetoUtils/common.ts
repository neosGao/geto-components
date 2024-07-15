import Decimal from "decimal.js";

// 限制输入框数字输入范围
export const inputHandle = (value, { min = 0, max = 10000, precision = 2 }) => {
  if (value !== "") {
    const str = value.toString();
    const match = str.match(/\d+\.?\d*/);
    if (!match) {
      value = "";
    } else {
      const valid = match[0];
      const deci = valid.split(".");
      if (deci.length > 1 && deci[1].length > precision) {
        value = parseFloat(valid).toFixed(precision);
      } else {
        value = valid;
      }
    }
  }
  let newValue = value;
  if (newValue < min) {
    newValue = min;
  } else if (newValue > max) {
    newValue = max;
  }
  return newValue;
};

/**
 * @author: ZYW
 * @description: 随机生成Guid
 * @param {type}
 * @return:
 */
export const getGuid = () => {
  const ids = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return ids;
};

/**
 * @description: 计算
 * @param {number|string|Decimal} value
 * @return: {add, minus, times, div}
 * @example:
 * import { calcutor } from "@/geto-components/GetoUtils/common";
 * const value = calcutor(0.1).add(0.2).toNumber();
 */
export const calcutor = value => {
  value = parseFloat(value);

  if (typeof value !== "number" || isNaN(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new Error("无效值");
  }

  const decimal = new Decimal(value);
  return {
    add(num) {
      return decimal.add(num);
    },
    sub(num) {
      return decimal.sub(num);
    },
    mul(num) {
      return decimal.mul(num);
    },
    div(num) {
      return decimal.div(num);
    }
  };
};

// 将金额数字转为千分符分割
export const numberWithCommas = (number, precision = "") => {
  if (/[\+\-\*\/\=,]/.test(number)) {
    return number;
  }
  if (["number", "string"].indexOf(typeof number) > -1) {
    const s = precision ? (+number).toFixed(precision) : number.toString();
    const digit = precision || (s.split(".")[1] ? s.split(".")[1].length : 0);
    const res = parseFloat(s).toLocaleString("en-US", {
      minimumFractionDigits: digit
    });
    if (isNaN(parseFloat(res))) {
      return number;
    }
    return res;
  }
  return number;
};

// 去除千分符
export const delNumberWithCommas = num => {
  if ((num + "").trim() == "") {
    return num;
  }
  num = String(num).replace(/,/gi, "");
  return num;
};

// 金额数字转为金额大写
export const convertToChineseNumber = money => {
  //汉字的数字
  const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  //基本单位
  const cnIntRadice = ["", "拾", "佰", "仟"];
  //对应整数部分扩展单位
  const cnIntUnits = ["", "万", "亿", "兆"];
  //对应小数部分单位
  const cnDecUnits = ["角", "分", "毫", "厘"];
  //整数金额时后面跟的字符
  const cnInteger = "整";
  //整型完以后的单位
  const cnIntLast = "元";
  //最大处理的数字
  const maxNum = "999999999999999.9999";
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = "";
  //分离金额后用的数组，预定义
  let parts;
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= Number(maxNum)) {
    //超出最大处理数字
    return "";
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != "") {
    const decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger;
  }
  return chineseStr;
};

// 防抖函数
export const useDebounce = (fn, delay) => {
  let timeout = null;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
