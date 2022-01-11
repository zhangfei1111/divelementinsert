/*
 * @Author: 张飞
 * @Date: 2021-09-08 13:51:06
 * @Description: 
 */
import MyDivInsert from "./src/index.vue";
MyDivInsert.install = function(Vue) {
    Vue.component(MyDivInsert.name, MyDivInsert);
};
export default MyDivInsert;