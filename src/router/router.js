import Vue from 'vue'
import VueRouter from 'vue-router';
import login from '@/view/login/login.vue'
import layout from '@/view/home/layout.vue'
import chart from '@/view/home/chart/chart.vue'
import userList from '@/view/home/userList/userList.vue'
import question from '@/view/home/question/question.vue'
import business from '@/view/home/business/business.vue'
import subject from '@/view/home/subject/subject.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: login,
            meta: {
                title:"登录",
                rules: ["超级管理员","管理员","老师","学生"]
                
            }
        },
        {
            path: "/home",
            redirect: "/home/subject",
            component: layout,
            children: [
                {
                    path: "chart",
                    component: chart,
                    meta: {
                        title:"数据概览",
                        rules: ["超级管理员","管理员","老师"],
                        icon: "el-icon-pie-chart"
                    }
                },
                {
                    path: "userList",
                    component: userList,
                    meta: {
                        title:"用户列表",
                        rules: ["超级管理员","管理员"],
                        icon: "el-icon-user"
                    }
                },
                {
                    path: "business",
                    component: business,
                    meta: {
                        title:"企业列表",
                        rules: ["超级管理员","管理员","老师"],
                        icon: "el-icon-office-building"
                    }
                },
                {
                    path: "subject",
                    component: subject,
                    meta: {
                        title:"学科列表",
                        rules: ["超级管理员","管理员","老师","学生"],
                        icon: "el-icon-notebook-2"
                    }
                },
                {
                    path: "question",
                    component: question,
                    meta: {
                        title:"题库列表",
                        rules: ["超级管理员","管理员","老师"],
                        icon: "el-icon-edit-outline"
                    }
                },
            ]
        }
    ]
});

import NProgress from "nprogress"
import 'nprogress/nprogress.css'
import store from "@/store/index.js"
import { Message } from 'element-ui';
import { removeToken } from "@/utils/token.js"
//导航守卫，进入前守卫
router.beforeEach((to, from, next)=>{
    NProgress.start()
    if (to.meta.rules.includes(store.state.role)) {
        next()
    } else {
        Message.warning("您无权访问该页面！")
        removeToken();
        next("/")
    }
    
})
// 进入后守卫
router.afterEach((to, from)=>{
    NProgress.done()
    document.title = to.meta.title;
    console.log(from);
})
export default router;