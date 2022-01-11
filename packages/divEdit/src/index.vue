<!--
 * @Author: 张飞
 * @Date: 2022-01-11 18:50:45
 * @Description: 
-->
<template>
  <btnDiv
    :divRef="divRef"
    :currentPop="this.normalPop"
    :powerFlag="powerFlag"
    @getText="getText"
    ref="normalMsg"
  ></btnDiv>
</template>
<script>
import btnDiv from "./btnDiv.vue";
export default {
  name: "Index",
  components: { btnDiv },
  data() {
    return {
      defaultInfo: {
        content: "",
        realContent: " ",
      },
      divRef: "commonEditDiv",
      powerFlag: true,
      normalPop: -1, // normalInfo对于normalMsg的currentPop的传值
    };
  },
  created() {},
  methods: {
    // 对带有特殊标签的字段进行正则匹配
    replaceContent(data) {
      const matchObject = {
        '<span class="customer-niki-name msg-value-blue" contenteditable="false">客户昵称</span>':
          "[客户昵称]",
        '<span class="customer-name msg-value-blue" contenteditable="false">员工姓名</span>':
          "[员工姓名]",
        '<span class="customer-zuoxi msg-value-blue" contenteditable="false">座席工号</span>':
          "[座席工号]",
      };
      const reStr = Object.keys(matchObject).join("|");
      const re = new RegExp(reStr, "g");
      return data.trim().replace(re, (it) => matchObject[it]);
    },
    // 获取欢迎语文字部分
    getText(info) {
      let content = "";
      if (info.val) {
        content = this.replaceContent(info.val);
      }

      if (info.currentPop === -1) {
        this.defaultInfo.realContent = info.val;
        this.defaultInfo.content = content;
      } else {
        this.periodList[info.currentPop].realContent = info.val;
        this.periodList[info.currentPop].content = content;
      }
      console.log(this.defaultInfo, "this.defaultInfo");
    },
  },
};
</script>
<style scoped lang='scss'>
</style>
