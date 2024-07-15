<template>
  <GetoWorkbenchcCard
    :title="title"
    v-loading="loading"
    @onRefresh="loadData"
    :h="config.h"
  >
    <template v-slot:card_header_btn>
      <el-link :underline="false" class="mr-2" type="primary" @click="goToList">
        查看全部（{{ total }}）</el-link
      >
    </template>
    <template v-slot:card_body>
      <div v-if="be_done_list?.length > 0">
        <div class="item" v-for="(item, index) in be_done_list" :key="index">
          <div class="body" @click="goToDetail(item)">
            <div class="content" :title="`【${item.app_name}】${item.submit_user_name}提交的${item.bills}申请单等待审批`">
              <span>【{{ item.app_name }}】</span>
              <span>{{ item.submit_user_name }}提交的 </span>
              <span>{{ item.bills }}</span>
              <span>等待审批</span>
            </div>
            <div class="time">
              <span>{{ item.reach_time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无数据" />
      </div>
    </template>
  </GetoWorkbenchcCard>
</template>

<script setup lang="ts">
import GetoWorkbenchcCard from "@/geto-components/GetoWorkbenchCard/index.vue";
import { defineOptions, defineProps, ref, onMounted } from "vue";
import { getComponentData,getAuditUrl,getMoreUrl} from "@/geto-components/GetoMspPage/api/workbench";
import { usePage,getUrlParam } from "@/geto-components/GetoUtils/page";

defineOptions({
  name: "BeDoneAudit"
});
defineProps({
  title: {
    type: String,
    default: ""
  },
  config: {
    type: Object,
    default: () => ({})
  }
});

const page = usePage();
const loading = ref(false);
const be_done_list = ref([]);
const total = ref(0);

const loadData = () => {
  loading.value = true;
  getComponentData({
    component: "BeDoneAudit"
  })
    .then((res: any) => {
      console.log("查看当前数据",res);
      let datas=res.data.list;
      for(let item of datas){
        if(!item.app_name){
          item.app_name=item.system_name||''
        }
      }
      be_done_list.value = datas;

      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const goToDetail = async (item: any) => {

  let res =await getAuditUrl({id:item.id})
  let pc_url=res.data.pc_url
    if(['sharegoo_dhr','kingdee','kingdee'].includes(item.system_code)){
      window.open(pc_url, '_blank');
    // win.focus();
    }else{
        console.log("111res",res)
        console.log("111item",item)
      // let url= 'http://192.168.64.139:8848/cloud/#/audit/detail?auditType=audit&id=26367&isIframe=1'

        //  page.addPageByQuery("iframeView", {
        //     url:`${pc_url}`
        //   },'审核详情');
      let  auditType = getUrlParam(pc_url, "auditType");
      let  id = getUrlParam(pc_url, "id");
      page.addPageByAudit("审核详情", {
        path: "/audit/detail",
        param: JSON.stringify({
          auditType: auditType,
          id:id
        })
      });
    }
};

const goToList =async  () => {
  // let res =await getMoreUrl();
    // console.log("res",res.data.integrate_approval);
    // if(res.code=='0'){
      // page.addIframePage("iframeView", {
      //   url:`${res.data.integrate_approval}?isIframe=1`
      // },'待办列表');
    page.addIframePage("审批待办", {
      path: `/approval/todo_list`,
      system_code: "todo.platform.dmp",
      param: JSON.stringify({})
    });

    // }


    // integrate_approval
  // page.addPageByAudit("待办列表", {
  //   path: "/approval/todo_list"
  // });
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 10px;
  font-size: 14px;
  .body {
    padding-bottom: 20px;
    .content {
      // 超出宽度显示省略号
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 隐藏超出容器的文本 */
      text-overflow: ellipsis; /* 显示省略号 */
      width: calc(100% - 120px);
      float: left;
    }
    .time {
      float: right;
      color: #999;
      font-size: 12px;
      margin-top: 2px;
      width: 120px;
      text-align: right;
    }
    .time:hover {
      color: #409eff;
    }
  }
}
.item:hover {
  color: #409eff;
  cursor: pointer;
}
</style>
