export const defaultFormFrame = {
  type: "input",
  prop: "",
  label: "",
  span: 24
};

export const assignFormFrame = (cols: any[], defaultVal = defaultFormFrame) =>
  cols.map(col =>
    Object.assign({}, { ...defaultFormFrame, ...defaultVal }, col)
  );

export const defaultData = (list: any[]) => {
  const formData = {};
  list.forEach(item => {
    if (item.multiple && item.multiple == true) {
      formData[item.prop] = [];
    } else {
      formData[item.prop] = "";
    }
  });
  return formData;
};

export const FrameItem = (prop: any, data: { formFrame: any[] }) =>
  data.formFrame.find(i => i.prop === prop);

export const setRules = (list: any[]) => {
  const rules = {};
  list.forEach(item => {
    if (item.required == true) {
      if (
        item.type == "input" ||
        item.type == "textarea" ||
        item.type == "inputNumber"
      ) {
        rules[item.prop] = [
          { required: true, message: `请输入${item.label}`, trigger: "blur" }
        ];
      } else if (item.multiple && item.multiple == true) {
        rules[item.prop] = [
          {
            required: true,
            message: `请选择${item.label}`,
            type: "array",
            trigger: "change"
          }
        ];
      } else {
        rules[item.prop] = [
          { required: true, message: `请选择${item.label}`, trigger: "change" }
        ];
      }
    }
  });
  return rules;
};

export const defaultForm = (form: any[]) => {
  return {
    formFrame: form,
    formData: defaultData(form),
    formRules: setRules(form)
  };
};
