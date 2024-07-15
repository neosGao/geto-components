<template>
  <div class="table">
    <template v-for="(row, r) in setting.rows" :key="r">
      <template v-if="row.type == 'header'">
        <div
          class="cell header"
          v-for="(header, index) in row.columns"
          :key="index"
        >
          <div class="p-2">
            {{ header.value }}
            <span v-if="header.required" style="color: red">*</span>
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="header.desc"
            >
              <template #reference>
                <span
                  v-if="header.desc"
                  style="color: blue; padding-left: 10px"
                >
                  ?</span
                >
              </template>
            </el-popover>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          :class="c !== 0 ? 'cell' : 'cell first-column'"
          v-for="(item, c) in row.columns"
          :key="c"
        >
          <template v-if="item.type == 'number'">
            <el-input-number
              style="width: 100%"
              v-model="item.value"
              @change="handleChangeValue(item.key)"
              :placeholder="item.placeholder ?? ''"
              :controls="false"
              :precision="item.precision"
            />
          </template>
          <template v-if="item.type == 'input'">
            <el-input
              style="width: 100%"
              v-model="item.value"
              @change="handleChangeValue(item.key)"
              :placeholder="item.placeholder ?? ''"
            />
          </template>
          <template v-if="item.type == 'text'">
            <div class="p-2">
              {{ item.value }}
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      cellWidth: "300px",
      rows: []
    })
  }
});
const column = ref("repeat(4, 300px)");
const formula = ref({});
const header = ref({});
const form = ref({});
const formula_columns = ref([]);
const genTable = (setting: any) => {
  const cellWidth = setting.cellWidth ?? "300px";

  column.value =
    "repeat(" + setting.rows[0].columns.length + ", " + cellWidth + ")";
  // 头部数据
  setting.rows.forEach((row: any) => {
    if (row.type == "header") {
      row.columns.forEach((item: any) => {
        header.value[item.value] = item.key;
        form.value[item.key] = "";
      });
    }
  });

  // 公式数据
  setting.rows.forEach((row: any) => {
    if (row.type == "row") {
      row.columns.forEach((item: any) => {
        if (item.formula == "") {
          return;
        }
        const keys = [];
        const labels = [];
        for (const label in header.value) {
          const header_key = header.value[label];
          if (item.formula.includes(label)) {
            keys.push(header_key);
            labels.push(label);
            formula_columns.value.push(header_key);
          }
        }

        formula.value[item.key] = {
          formula: item.formula,
          keys: keys,
          labels: labels
        };
      });
    }
  });
  formula_columns.value = Array.from(new Set(formula_columns.value));
};
const setting: any = ref({});
watch(
  () => props.config,
  async val => {
    if (val.rows.length < 1) {
      return;
    }
    setting.value = cloneDeep(val);
    genTable(setting.value);
  },
  {
    immediate: true
  }
);
const handleChangeValue = (item: any) => {
  if (!formula_columns.value.includes(item)) {
    return;
  }
  // 查找变动值涉及的公式
  const compute_flrmula = [];
  for (const column in formula.value) {
    if (formula.value[column].keys.includes(item)) {
      const value = formula.value[column];
      value.compute_column = column;
      value.compute_value = "";
      value.compute_formlua = value.formula;
      compute_flrmula.push(value);
    }
  }
  if (compute_flrmula.length < 1) {
    return;
  }
  setting.value.rows.forEach((row: any) => {
    if (row.type == "row") {
      row.columns.forEach((item: any) => {
        let value = "";
        value = item.value == "" ? "0" : item.value;
        // ToDo转义
        form.value[item.key] = value;
      });
    }
  });
  compute_flrmula.forEach((item: any) => {
    const values = [];
    item.keys.forEach((key: any) => {
      values.push(form.value[key]);
    });
    item.labels.forEach((label: any, index: any) => {
      item.compute_formlua = replaceAll(
        item.compute_formlua,
        label,
        values[index]
      );
    });
    item.compute_value = eval(item.compute_formlua);
    // 赋值
    setting.value.rows.forEach((row: any) => {
      if (row.type == "row") {
        row.columns.forEach((column: any) => {
          if (column.key == item.compute_column) {
            column.value = item.compute_value;
          }
          form.value[column.value] = column.value;
        });
      }
    });
  });
};

const replaceAll = (str, find, replace) => {
  if (str.indexOf(find) === -1) {
    return str;
  }

  return replaceAll(str.replace(find, replace), find, replace);
};

defineExpose({
  getForm() {
    return form.value;
  }
});
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px;
  height: 5px;
  background-color: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #c9c9cf;
  border-radius: 6px;
}

::v-deep(.el-input__wrapper) {
  box-shadow: none;
}

::v-deep(.el-input__inner) {
  text-align: center;
}

.table {
  display: grid;
  grid-template-columns: v-bind(column);
  gap: 0px;
  border: 1px solid #f0f2f5;
  overflow-x: scroll;
}

.cell {
  font-size: 14px;
  border-right: 1px solid #f0f2f5;
  border-bottom: 1px solid #f0f2f5;
  padding: 0px 0px;
  text-align: center;
}

.header {
  font-size: 14px;
  font-weight: bold;
  background-color: rgb(250, 250, 250);
  border-right: 1px solid #f0f2f5;
  border-bottom: 1px solid #f0f2f5;
}

.first-column {
  background-color: rgb(250, 250, 250);
  font-weight: bold;
}
</style>
