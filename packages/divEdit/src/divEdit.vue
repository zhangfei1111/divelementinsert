<!--
 * @Descripttion:  可输入的div实现v-model
 * @Author: penglu
 * @Date: 2021-08-04 12:17:09
-->

<template >
  <div class="edit-wrapper">
    <div
      class="edit-div"
      :contenteditable="canEdit"
      data-placeholder="请输入群发消息..."
      @focus="editFocus"
      @blur="isLocked = false"
      @input="changeText"
      v-html="innerText"
      @paste="pasteChange"
      ref="editDiv"
    ></div>
  </div>
</template>
<script >
export default {
  name: "divEdit",
  props: {
    value: {
      type: String,
      default: "",
    },
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false,
      count: 0,
    };
  },
  watch: {
    value() {
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value;
        console.log(this.innerText.length);
      }
    },
  },
  methods: {
    editFocus() {
      this.isLocked = true;
    },
    changeText() {
      setTimeout(() => {
        // 在父组件中给予空格,因为在contenteditable存在首次输入光标对象判断异常,在插入数据前进行取出空格
        this.$emit("input", this.$refs.editDiv.innerHTML.trim());
      }, 5);
    },
    // 粘贴文本，去除文本带的各种html标签
    pasteChange(aEvent) {
      // console.log(aEvent)
      const text = aEvent.clipboardData.getData("text/plain");
      // console.log(text)
      aEvent.preventDefault();
      this.insert(text);
    },
    // 向光标处塞入内容
    insert(html) {
      const editDom = this.$refs.editDiv;
      editDom.focus();
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
      setTimeout(() => {
        // 在父组件中给予空格,因为在contenteditable存在首次输入光标对象判断异常,在插入数据前进行取出空格
        this.$emit("input", this.$refs.editDiv.innerHTML.trim());
      }, 5);
    },
    // 粘贴完鼠标默认在最后
    keepLastIndex(obj) {
      let range;
      if (window.getSelection) {
        // ie11 10 9 ff safari
        obj.focus(); // 解决ff不获取焦点无法定位问题
        range = window.getSelection(); // 创建range
        range.selectAllChildren(obj); // range 选择obj下所有子内容
        range.collapseToEnd(); // 光标移至最后
      } else if (document.selection) {
        // ie10 9 8 7 6 5
        range = document.selection.createRange(); // 创建选择对象
        // var range = document.body.createTextRange();
        range.moveToElementText(obj); // range定位到obj
        range.collapse(false); // 光标移至最后
        range.select();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .edit-div {
    width: 100%;
    height: 100%;
    overflow: auto;
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
    &:empty:before {
      content: attr(data-placeholder);
      color: #bbb;
      font-size: 14px;
    }
    &:focus:before {
      content: none;
    }
    // 回车无div
    -webkit-user-modify: read-write-plaintext-only;
  }
  .show-limit {
    position: absolute;
    bottom: 0;
    right: 0;
    color: grey;
  }
}
</style>
