import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // ...
    state: {
        userInfo: "",
        roleObj: {
            1: "超级管理员",
            2: "管理员",
            3: "老师",
            4: "学生"
        },
        role: "超级管理员"
    }
})

export default store;