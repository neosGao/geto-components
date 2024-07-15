<template>
  <div class="flex">
    <div class="w-full" v-show="tableType === 'detail'">
      <el-table :data="tableData" border style="width: 100%" ref="leftTable">
        <el-table-column
          v-for="(item, index) in tableDetailConfig"
          :prop="item.prop"
          align="center"
          :label="item.label"
          :key="index"
        />
      </el-table>
      <div class="shadow m-2 p-2 font-bold">
        列汇总 ({{ avg_type_list }}) --
        {{ aggregate_data_str }}
      </div>
    </div>
    <!-- 左图表 -->
    <GetoSingleChart
      v-show="tableType === 'chart'"
      ref="chart"
      class="w-[700px] h-[700px] p-[20px]"
    />
    <div v-show="tableType === 'chart'" class="flex-1 p-[20px]">
      <!-- 右表格 -->
      <el-table :data="tableData" border style="width: 100%" ref="rightTable">
        <el-table-column
          v-for="(item, index) in tableConfig"
          :prop="item.prop"
          align="center"
          :label="item.label"
          :key="index"
        />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import GetoSingleChart from "@/geto-components/GetoSingleChart/index.vue";
import { getChartData } from "../statementListApi";
import { cloneDeep } from "@pureadmin/utils";

defineOptions({
  name: "chart_page"
});

const props = defineProps({
  id: {
    type: Number,
    default: () => 0
  }
});
const tableType = ref<string>("detail");
const tableData = ref([]);
const tableConfig = ref([]);
const tableDetailConfig = ref([]);
const chart = ref();
const statement = ref<any>();
const id_ref = ref<number>(0);
const leftTable = ref(null);
const rightTable = ref(null);
const aggregate_data = ref({});
const aggregate_data_str = ref("");
const avg_type_list = ref("");

const setChart = () => {
  // 对应字段列表
  const file_list = statement.value?.statement_info?.field_name_map;
  // X轴标题
  const Xtitle = [
    ...new Set(
      statement.value.chart_data.map(
        item => item[statement.value.statement_info.main_dimension]
      )
    )
  ];
  // 副轴标题字段
  const second_title = statement.value.statement_info.legend.fields[0];

  // 2个维度  1个数据 决定是否使用堆叠
  const group_type = Boolean(
    statement.value.statement_info.group_by_field.length == 2 &&
      statement.value.statement_info.statistic_field.length == 1
  );
  const value_type = statement.value.statement_info.statistic_field.filter(
    item => item != second_title
  )[0];
  // 标题翻译
  const chart_title = statement.value.statement_info.name;
  const x_chart_title =
    file_list[statement.value.statement_info.main_dimension];
  const y_chart_title = file_list[value_type];
  // 获取数据方法
  const chart_data_arr = item => {
    const arr = [];
    statement.value.statement_info.main_dimension_data.forEach((a, b) => {
      statement.value.chart_data.forEach(c => {
        if (group_type) {
          // 我是两个维度时
          if (
            a === c[statement.value.statement_info.main_dimension] &&
            item === c[second_title]
          ) {
            arr[b] = c[value_type];
          }
        } else {
          // 我是一个维度时
          if (a === c[statement.value.statement_info.main_dimension]) {
            arr[b] = c[second_title];
          }
        }
      });
    });
    return arr;
  };
  // 基础配置
  const chart_options = {
    title: {
      text: chart_title,
      left: "center", // 设置标题居中
      top: "5%" // 设置标题距离上方的位置
    },
    grid: {},
    toolbox: {
      feature: {
        saveAsImage: {
          title: "保存图片",
          name: chart_title // 默认保存的文件名
        }
      }
    },
    tooltip: {},
    legend: {},
    xAxis: {},
    yAxis: {},
    series: [],
    addTooltip: true
  };
  // 默认值
  chart_options.grid = {
    top: "15%", // 设置 grid 的上方距离，留出空间给 title
    left: "10%",
    right: "10%",
    bottom: "10%",
    containLabel: true
  };
  chart_options.tooltip = {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  };
  chart_options.legend = {
    data: statement.value.statement_info.legend.data,
    top: "10%" // 设置 legend 的上方距离
  };
  chart_options.xAxis = {
    type: "category",
    data: Xtitle as string[],
    name: x_chart_title
  };
  chart_options.yAxis = { type: "value", name: y_chart_title };
  // 差异选择
  switch (statement.value.statement_info.chart_type) {
    case "horizontal_bar":
      // XY轴处理
      chart_options.xAxis = {
        type: "value",
        name: y_chart_title,
        axisLabel: {
          interval: 0 // 每隔一个显示一个
        }
      };
      chart_options.yAxis = {
        type: "category",
        data: Xtitle as string[],
        name: x_chart_title,
        axisLabel: {
          interval: 0 // 每隔一个显示一个
        }
      };
      // series内容处理
      chart_options.series = statement.value.statement_info.legend.data.map(
        item => {
          return {
            name: item,
            type: "bar",
            stack: group_type ? "stack" : null,
            data: chart_data_arr(item)
          };
        }
      );
      break;
    case "column":
      // XY轴处理
      chart_options.xAxis = {
        type: "category",
        data: Xtitle as string[],
        name: x_chart_title,
        axisLabel: {
          interval: 0 // 每隔一个显示一个
        }
      };
      chart_options.yAxis = {
        type: "value",
        name: y_chart_title,
        axisLabel: {
          interval: 0 // 每隔一个显示一个
        }
      };
      // series内容处理
      chart_options.series = statement.value.statement_info.legend.data.map(
        item => {
          return {
            name: item,
            type: "bar",
            stack: group_type ? "stack" : null,
            data: chart_data_arr(item)
          };
        }
      );
      break;

    case "curve":
      // XY轴处理
      // series内容处理
      chart_options.series = statement.value.statement_info.legend.data.map(
        item => {
          return {
            name: item,
            type: "line",
            stack: group_type ? "stack" : null,
            data: chart_data_arr(item)
          };
        }
      );
      break;

    case "pie":
      // XY轴处理
      chart_options.grid = {};
      chart_options.tooltip = {
        trigger: "item"
      };
      chart_options.legend = {
        orient: "vertical",
        left: "left"
      };
      chart_options.xAxis = null;
      chart_options.yAxis = null;
      // series内容处理
      chart_options.series = [
        {
          name: statement.value.statement_info.legend.data[0],
          type: "pie",
          radius: "50%",
          data: statement.value.statement_info.main_dimension_data.map(
            (item, index) => {
              return {
                value: chart_data_arr(item)[index],
                name: item
              };
            }
          ),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ];
      break;

    case "radar":
      // XY轴处理
      chart_options.grid = null;
      chart_options.tooltip = {
        show: true, // 是否显示提示框，默认为 true
        trigger: "item" // 触发类型，可选值：'item'、'axis'
      };
      chart_options.xAxis = null;
      chart_options.yAxis = null;
      chart_options.title.top = "0%";
      chart_options.legend["top"] = "5%";
      chart_options["radar"] = {
        indicator: statement.value.statement_info.main_dimension_data.map(
          item => {
            return { name: item };
          }
        )
      };
      // series内容处理
      chart_options.series = [
        {
          type: "radar",
          data: statement.value.statement_info.legend.data.map(item => {
            return {
              value: chart_data_arr(item),
              name: item
            };
          })
        }
      ];
      break;

    case "funnel":
      // XY轴处理
      chart_options.grid = null;
      chart_options.tooltip = {
        show: true, // 是否显示提示框，默认为 true
        trigger: "item" // 触发类型，可选值：'item'、'axis'
      };
      chart_options.xAxis = null;
      chart_options.yAxis = null;
      chart_options.title.top = "0%";
      chart_options.legend = {
        data: statement.value.statement_info.main_dimension_data,
        top: "5%" // 设置 legend 的上方距离
      };
      // series内容处理
      chart_options.series = [
        {
          type: "funnel",
          left: "10%",
          top: 60,
          bottom: 60,
          width: "80%",
          min: 0,
          max: 100,
          minSize: "0%",
          maxSize: "100%",
          sort: "descending",
          gap: 2,
          label: {
            show: true,
            position: "inside"
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: "solid"
            }
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: statement.value.statement_info.main_dimension_data.map(
            (item, index) => {
              return {
                value: chart_data_arr(item)[index],
                name: item
              };
            }
          )
        }
      ];
      break;

    default:
      break;
  }
  chart.value.setOptions(chart_options);
};
const initChart = async (condition = []) => {
  if (!props.id) return;
  id_ref.value = props.id;
  const res: res = await getChartData({ id: props.id, condition });
  if (res.code !== "0") return;
  useChart(res.data);
};
const useChart = params => {
  tableConfig.value = [];
  tableDetailConfig.value = [];
  // 数据本地化
  statement.value = {
    statement_info: cloneDeep(params.statement_info || {}),
    chart_data: cloneDeep(params.chart_data || {})
  };
  if (params?.statement_info.chart_type === "detail_list") {
    tableType.value = "detail";
    // 明细列表
    Object.keys(params.chart_data[0]).forEach(key => {
      tableDetailConfig.value.push({
        prop: key,
        label: params.statement_info?.field_name_map[key]
      });
    });
    tableData.value = params.chart_data;
    aggregate_data.value = params.aggregate_data;
    aggregate_data_str.value = Object.entries(aggregate_data.value)
      .map(([key, value]) => {
        if (value != "") {
          return `${statement.value?.statement_info?.field_name_map[key]}：${value}`;
        } else {
          return "";
        }
      })
      .filter(item => item != "")
      .join(", ");
    const list_type = [
      {
        value: "avg",
        name: "AVG",
        label: "平均值"
      },
      {
        value: "sum",
        name: "SUM",
        label: "求和"
      },
      {
        value: "max",
        name: "MAX",
        label: "最大值"
      },
      {
        value: "min",
        name: "MIN",
        label: "最小值"
      }
    ];
    avg_type_list.value = list_type.filter(
      item => item.value === statement.value.statement_info.aggregate_type
    )[0]["label"];
  } else {
    tableType.value = "chart";
    tableData.value = params.statistic_data;
    if (params?.statistic_data) {
      const arr = [];
      Object.keys(params.statistic_data[0]).forEach(key => {
        arr.push({
          prop: key,
          label: params.statement_info?.field_name_map[key]
        });
      });
      tableConfig.value = [...new Set(arr)]; //去重
    }
    setChart();
  }
};
watch(props, val => {
  if (id_ref.value != val.id) {
    initChart();
  }
});
onMounted(async () => {
  initChart();
});
defineExpose({
  // 暴露出子组件方法
  initChart,
  useChart
});
</script>
