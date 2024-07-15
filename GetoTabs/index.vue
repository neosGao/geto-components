<template>
  <div class="geto-tabs">
    <el-tabs class="eltabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in configParams"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <template #label>
          <IconifyIconOffline class="notification" :icon="flag" v-if="item.is_default" />
          <IconifyIconOffline
            class="notification"
            :icon="notification"
            v-if="item.is_global_view"
          />
          <span>{{ item.name }}</span>
        </template>
        <GetoSearch
          v-if="activeName === item.name"
          :config="item.conf.search"
          @onSearch="onSearch"
          @onReset="onReset"
          @onCustomReset="onCustomReset"
          @onChangeData="(row, config, conditions) => onChangeData(row, config, conditions)"
          :diySearchConfig="item"
          :viewName="item.name"
          :default_view="configParams[index]"
          :searchAuth="props.searchAuth"
          :isCustomReset="isCustomReset"
          :list_key="configParams[0]['list_key']"
        >
          <template v-slot:searchItem="{ slotItem }">
            <slot name="searchItem" :slotItem="slotItem" />
          </template>
        </GetoSearch>
        <GetoViewSetting class="view-setting" :config="configParams" :tabsName="tabsName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from "vue";
import { confType } from "./types";
import GetoSearch from "../GetoSearch/index.vue";
import GetoViewSetting from "../GetoViewSetting/index.vue";
import type { TabsPaneContext } from "element-plus";
import notification from "@iconify-icons/ep/notification";
import flag from "@iconify-icons/ep/flag";
import { emitter } from "@/utils/mitt"; //使用mitt进行事务管理
import { cloneDeep } from "@pureadmin/utils";
defineOptions({
  name: "GetoTabs"
});

const props = defineProps({
  params: {
    type: Array<confType>,
    default: () => []
  },
  defaultTab: {
    type: String,
    default: () => ""
  },
  searchAuth: {
    type: String,
    default: () => ""
  },
  isCustomReset: {
    type: Boolean,
    default: () => false
  }
});

const configParams = ref(cloneDeep(props.params));

const emits = defineEmits(["onSearch", "tabsClick", "onReset", "onCustomReset", "onChangeData"]); // 定义发射给父组件的事件

const tabsName = ref([]);

const activeName = ref("");
const handleClick = (tab: TabsPaneContext, event: Event) => {
  emitter.emit("showPageListSave", tab.paneName as string);
  activeName.value = tab.paneName as string;
  emits("tabsClick", tab, event);
  // emits("onSearch", { view_name: activeName.value });
};
const onSearch = val => {
  val.view_name = activeName.value;
  // 此时充当中间件
  emits("onSearch", val);
};

const onReset = () => {
  emits("onReset");
};

const onCustomReset = (inputItem, inputItemSearch) => {
  emits("onCustomReset", inputItem, inputItemSearch);
};

const onChangeData = (row, config, conditions) => {
  emits("onChangeData", row, config, conditions);
};

watch(props, val => {
  tabsName.value = val?.params?.map(item => item.name);
  if (val.defaultTab) {
    activeName.value = val.defaultTab;
  } else {
    props.params.forEach(item => {
      if (item.is_default && !activeName.value) {
        activeName.value = item.name;
      }
    });
  }
});

watch(
  () => props.params,
  val => {
    configParams.value = val;
  }
);

defineExpose({
  activeName
});
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  overflow: unset;
}
.geto-tabs {
  padding: 0px 10px;
  background-color: #fff;
  position: relative;
  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .view-setting {
    position: absolute;
    right: 0px;
    top: -42px;
    font-size: 18px;
    color: #929292;
  }
  .notification {
    position: relative;
    font-size: 16px;
    cursor: pointer;
    transition: transform 1s;
    margin-right: 3px;
    margin-top: 2px;
  }
}
</style>
