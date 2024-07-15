<template>
  <div>
    <div ref="chartRef" :class="props.class" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";

const props = defineProps({
  class: {
    type: String,
    default: () => "w-[600px] h-[700px] p-[20px]"
  }
});

const chartRef = ref<HTMLDivElement | null>(null);

const {
  setOptions,
  clear,
  resize,
  getDom,
  getWidth,
  getHeight,
  getOption,
  getDataURL,
  appendData,
  getInstance,
  showLoading,
  hideLoading,
  getConnectedDataURL
} = useECharts(chartRef as Ref<HTMLDivElement>);

defineExpose({
  // 暴露出子组件方法
  chartRef,
  setOptions, //设置图表的配置项和数据
  clear, //清空当前实例，会移除实例中所有的组件和图表
  resize, //改变图表尺寸
  getDom, //获取ECharts实例容器的dom节点
  getWidth, //获取ECharts实例容器的宽度
  getHeight, //获取ECharts实例容器的高度
  getOption, //获取当前实例中维护的option对象
  getDataURL, //导出图表图片，返回一个base64的URL，可以设置为Image的src
  appendData, //此接口用于，在大数据量（百万以上）的渲染场景，分片加载数据和增量渲染
  getInstance, //获取ECharts实例
  showLoading, //显示加载动画效果
  hideLoading, //隐藏加载动画
  getConnectedDataURL //导出联动的图表图片，返回一个base64的url，可以设置为Image的src。导出图片中每个图表的相对位置跟容器的相对位置有关
});
</script>
