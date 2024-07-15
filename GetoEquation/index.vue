<template>
  <div v-if="dialogVisible">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :close-on-click-modal="false"
      @close="resetDesgin"
      width="466px"
      draggable
      top="6vh"
    >
      <div class="editor">
        <div class="flex">
          <div class="w-4/5">
            <div>
              {{ placeholder }}
            </div>
            <div>
              <el-input
                ref="inputRef"
                type="textarea"
                v-model="equationValue"
                :readonly="!isInput"
                @input="validateInput"
                @blur="validateBlur"
              />
            </div>
            <div class="flex flex-wrap">
              <el-button
                v-for="(item, index) in editorButton"
                :key="index"
                class="button-number"
                :disabled="item === ' '"
                @click="buttonVoluation(item)"
              >
                {{ item }}
              </el-button>
            </div>
          </div>
          <div class="w-1/5 flex flex-col items-center">
            <el-button class="button-operation" type="primary" @click="confirm"
              >确定</el-button
            >
            <el-button class="button-operation" type="danger" @click="reset"
              >清除</el-button
            >
            <el-button class="button-operation" type="warning" @click="withdraw"
              >回退</el-button
            >
            <el-button class="button-operation" type="" @click="cancel"
              >取消</el-button
            >
            <slot name="buttonOperation" />
          </div>
        </div>
        <div v-if="additionalmessage.hasAdditional ?? true">
          <div>{{ additionalmessage.additionalTitle ?? "要素" }}</div>
          <div class="editor-element">
            <el-button
              class="button-element"
              size="small"
              v-for="(item, index) in additionalmessage.depreciation_element"
              :key="index"
              :disabled="additionalmessage.disabledElement ?? false"
              round
              @click="buttonVoluation(item)"
            >
              {{ item }}
            </el-button>
          </div>
        </div>
        <!-- 额外内容 -->
        <slot name="additional" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

defineOptions({
  name: "GetoEquation"
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: "算式编辑器"
  },
  placeholder: String,
  editorButton: {
    type: Array as PropType<(string | number)[]>,
    default: () => [
      "<",
      "≤",
      ">",
      "≥",
      "≠",
      "7",
      "8",
      "9",
      "&",
      "|",
      "4",
      "5",
      "6",
      "(",
      ")",
      "1",
      "2",
      "3",
      "*",
      "/",
      "0",
      "MOD",
      ".",
      "+",
      "-",
      "=",
      "∈",
      "∉",
      "{",
      "}",
      "[",
      "]",
      ",",
      "X",
      "/10000"
    ]
  },
  additionalmessage: {
    type: Object as PropType<{
      //是否 需要 附加 要素
      hasAdditional?: boolean;
      // 附件标题
      additionalTitle?: string;
      // 控制 要素按钮的 状态
      disabledElement?: boolean;
      // 要素 的值
      depreciation_element?: string[];
    }>,
    default: () => ({
      hasAdditional: true,
      additionalTitle: "要素",
      disabledElement: false,
      depreciation_element: ["h", "n", "m", "c"]
    })
  },
  isInput: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "update:visible", "confirm"]);

const dialogVisible = useVModel(props, "visible", emit);

const inputRef = ref();

const equationValue = useVModel(props, "modelValue", emit);
const editorButton = props.editorButton.map(item => String(item));
// 记录初始值
const initial = ref("");
// 记录历史数据
const history = ref<string[]>([]);

const buttonVoluation = (value: string | number) => {
  if (history.value[0] === undefined) {
    // 存储初始值
    history.value.push(equationValue.value);
  }
  let newValue = equationValue.value;

  if (newValue) {
    //  拼接点击的符号
    newValue =
      newValue.slice(0, blurIndex) + String(value) + newValue.slice(blurIndex);
  } else {
    newValue = String(value);
  }
  blurIndex += 1;
  //  记录输入的历史数据
  equationValue.value = newValue;
  history.value.push(newValue);
};

const confirm = () => {
  dialogVisible.value = false;
  emit("confirm");
};

const reset = () => {
  // 省略了原来的实现，因为它在 Vue 2 和 Vue 3 中是相同的
  if (!equationValue.value) return;
  // 记录清除前的数据
  history.value.push(equationValue.value);
  // 输入的数据 清除
  equationValue.value = "";
};

const withdraw = () => {
  const length = history.value.length;
  if (length == 0) {
    if (!initial.value) return;
    const leng = equationValue.value.length;
    if (leng) {
      equationValue.value = equationValue.value.substring(0, leng - 1);
    }
  } else if (length == 1) {
    if (initial.value) {
      // 清除撤回  回到清除前的值
      equationValue.value = history.value.shift();
      history.value = [];
    } else {
      // 清除撤回   回到初始值
      equationValue.value = initial.value;
      history.value = [];
    }
  } else {
    // 删除 历史数据的最后一个 数据
    history.value.pop();
    // 撤回  获取上个数据
    const len = history.value.length - 1;
    equationValue.value = history.value[len];
  }
};

const cancel = () => {
  dialogVisible.value = false;
};

const resetDesgin = () => {
  equationValue.value = "";
  initial.value = "";
  history.value = [];
};

let blurIndex = 0;
const validateBlur = e => {
  // 保存当前光标位置
  blurIndex = e.srcElement.selectionStart;
};
const validateInput = value => {
  const validChars = editorButton.concat(
    props.additionalmessage.depreciation_element || []
  );

  const valueArr = value.split("");

  // 检测是否存在连续字符 MOD
  const index = valueArr.findIndex((char, i) => {
    return char === "M" && valueArr[i + 1] === "O" && valueArr[i + 2] === "D";
  });

  // 如果找到连续字符 MOD，则将其替换为 MOD
  if (index !== -1) {
    valueArr.splice(index, 3, "MOD");
  }

  const newValue = valueArr
    .filter(char => validChars.includes(String(char)))
    .join("");

  equationValue.value = newValue;
  history.value.push(newValue);
};

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      initial.value = equationValue.value;
    } else {
      initial.value = "";
      history.value = [];
    }
  }
);

defineExpose({
  buttonVoluation
});
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  margin-left: 0;
}

.dialog-footer {
  text-align: center;
}

.editor {
  .button-number {
    width: 60px;
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    margin: 10px 10px 10px 0;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
  .button-operation {
    width: 80px;
    margin: 0 0 10px 10px;
  }
  &-element {
    .button-element {
      margin: 5px;
    }
  }
}
</style>
