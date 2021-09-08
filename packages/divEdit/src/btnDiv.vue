<template>
  <div class="home">
    <el-button class="wm-header-bot" @click="insert('divRef')"
      >【插入客户昵称】</el-button
    >
    <div-edit
      v-model="modelValue"
      ref="divRef"
      :canEdit="powerFlag"
      @input="editDivInput"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import DivEdit from "./divEdit.vue";

export default {
  name: "MyDivInsert",
  components: {
    DivEdit,
  },
  props: {
    iconFontValue: {
      type: String,
      default() {
        return "icon-alia-Customernickname";
      },
    },
    realContent: {
      type: String,
      default() {
        return " ";
      },
    },
    placeholder: {
      type: String,
      default: "请输入内容...",
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.realContent;
      },
      set() {},
    },
  },
  data() {
    return {
      divData: {
        val: "",
        html: "",
      },
      powerFlag: true,
    };
  },
  methods: {
    editDivInput(val) {
      this.divData.val = val;
      this.divData.html = this.$refs.divRef.$refs.editDiv.innerHTML;
      this.$emit("getText", this.divData);
    },
    // 向光标处塞入内容
    insert() {
      const editDom = this.$refs.divRef.$refs.editDiv;
      editDom.focus();
      const html = `<wt-span><i class="iconfont ${this.iconFontValue} msg-value-blue"></i></wt-span>&#8203`;
      let sel, range;
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
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
      this.divData.html = editDom.innerHTML;
      this.$emit("getText", this.divData);
    },
  },
};
</script>
<style lang="scss" scoped>
.wm-header-bot {
  background-color: transparent;
  span {
    color: #3b74ef;
  }
}
::v-deep .msg-value-blue {
  color: #3b74ef;
}
</style>
