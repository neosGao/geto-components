<template>
  <div class="geto-task-log">
    <div>
      <el-row class="mb-2" v-for="(item, index) in data" :key="index">
        <el-col :span="2">
          <IconifyIconOffline
            v-if="item.type === 'update'"
            style="color: #909090; font-size: 16px; margin: 5px auto 0"
            :icon="share"
          />
          <IconifyIconOffline
            v-if="item.type === 'edit'"
            style="color: #909090; font-size: 16px; margin: 5px auto 0"
            :icon="edit"
          />
        </el-col>
        <el-col :span="22">
          <div class="mb-1">
            <span class="user mr-1">{{ item.userName }}:</span>
            <span class="change-mode mr-1">{{
              item.type === "edit" ? "编辑了工作项属性" : "更新了工作项状态"
            }}</span>
            <span class="delete-message" v-if="item.deleteData">{{
              item.deleteData
            }}</span>
            <IconifyIconOffline
              v-if="item.deleteData"
              style="
                color: #909090;
                display: inline;
                position: relative;
                top: 2px;
              "
              :icon="arrowRightBold"
            />
            <span class="success-message" v-if="item.successData">{{
              item.successData
            }}</span>
          </div>
          <template v-if="Array.isArray(item.timeLine)">
            <div class="time-box pl-2" v-for="(j, k) in item.timeLine" :key="k">
              <span class="time-line">{{ j.timeMsg }}</span>
              <span class="ml-1 delete-message" v-if="j.deleteTime">{{
                j.deleteTime
              }}</span>
              <IconifyIconOffline
                v-if="j.deleteTime"
                style="
                  color: #909090;
                  display: inline;
                  position: relative;
                  top: 2px;
                "
                :icon="arrowRightBold"
              />
              <span class="ml-2 success-message">{{ j.successTime }}</span>
              <span class="ml-2 time-line">{{ j.editTime }}</span>
            </div>
          </template>
          <template v-else>
            <div class="time-line">{{ item.timeLine }}</div>
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import share from "@iconify-icons/ep/share"; //ep:share
import edit from "@iconify-icons/ep/edit"; //ep:edit
import arrowRightBold from "@iconify-icons/ep/arrow-right-bold"; //ep:arrow-right-bold
defineOptions({
  name: "GetoTaskLog"
});

const data = [
  {
    type: "update",
    userName: "高文进",
    deleteData: "运营方案已确认",
    successData: "待完善",
    timeLine: "08月25日"
  },
  {
    type: "edit",
    userName: "罗北锐",
    successData: "待完善",
    timeLine: [
      {
        timeMsg: "开发截止日期",
        deleteTime: "2023-09-04",
        successTime: "2023-09-05",
        editTime: "08月25日"
      },
      {
        timeMsg: "截止日期",
        successTime: "2023-09-05",
        editTime: "08月26日"
      }
    ]
  }
];
</script>

<style scoped lang="scss">
.geto-task-log {
  background-color: #fff;
  font-size: 12px;
  color: #303030;
  font-weight: 500;
  width: 400px;
  .change-mode,
  .time-line {
    color: #909090;
  }
  .delete-message {
    color: #ea0d0d;
    text-decoration: line-through;
    text-decoration-color: #ea0d0d;
    background-color: rgba(234, 13, 13, 0.1);
  }
  .success-message {
    color: #24b47e;
    background-color: rgba(36, 180, 126, 0.1);
  }
  .time-box {
    border-left: 3px solid #909090;
  }
}
</style>
