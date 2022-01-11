<!--
 * @Author: 张飞
 * @Date: 2021-09-08 13:51:06
 * @Description: 
-->
<template>
  <div class="home">
    <el-button
      v-for="(item, index) in btnArr"
      :key="index"
      class="wm-header-bot"
      @click="insert(divRef, index + 1)"
      >{{ item.label }}</el-button
    >
    <divEdit
      v-model="info.realContent"
      :ref="divRef"
      :canEdit="powerFlag"
      @input="editDivInput"
    >
    </divEdit>
  </div>
</template>

<script>
// @ is an alias to /src
import divEdit from "./divEdit.vue";

export default {
  name: "btnDiv",
  components: { divEdit },
  props: {
    // 用于可编辑div鼠标点击区域的框定
    divRef: {
      type: String,
      default: "",
    },
    // 权限
    powerFlag: {
      type: Boolean,
      default: true,
    },
    // 此组件在父组件操作的索引
    currentPop: {
      type: Number,
      default: -1,
    },
    // 父组件传来的基本信息
    defaultInfo: {
      type: Object,
      default: () => ({
        rules: {},
      }),
    },
  },
  computed: {
    info() {
      return JSON.parse(JSON.stringify(this.defaultInfo));
    },
  },
  data() {
    return {
      btnArr: [
        { label: "【插入客户昵称】" },
        { label: "【插入员工姓名】" },
        { label: "【插入员工座席工号】" },
      ],
    };
  },
  methods: {
    // 向光标处塞入内容
    insert(ref, type) {
      const editDom = this.$refs[ref].$refs.editDiv;
      console.log(editDom, "editDom");
      editDom.focus(); // 编辑框设置焦点
      let html = "";
      if (type === 1) {
        html = `<span class="customer-niki-name msg-value-blue" contentEditable="false">客户昵称</span>`;
      } else if (type === 2) {
        html = `<span class="customer-name msg-value-blue" contentEditable="false">员工姓名</span>`;
      } else if (type === 3) {
        html = `<span class="customer-zuoxi msg-value-blue" contentEditable="false">座席工号</span>`;
      }

      let sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection(); // 获取选定对象
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0); // 设置最后光标对象
          range.deleteContents();
          // Range.createContextualFragment() 不适用ie9
          const el = document.createElement("div");
          el.innerHTML = html;
          const frag = document.createDocumentFragment();
          let node;
          let lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          // 维护选取
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type !== "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }
      const params = {
        val: editDom.innerHTML,
        currentPop: this.currentPop,
      };

      this.$emit("getText", params);
    },
    // 可编辑div的@input
    editDivInput(val) {
      const params = {
        val,
        currentPop: this.currentPop,
      };
      this.$emit("getText", params);
    },
  },
};
</script>
<style>
.msg-value-blue {
  color: #4385ff;
  font-size: 12px;
  position: relative;
}
</style>
