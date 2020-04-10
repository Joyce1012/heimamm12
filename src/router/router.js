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
            component: login
        },
        {
            path: "/home",
            redirect: "/home/subject",
            component: layout,
            children: [
                {
                    path: "chart",
                    component: chart
                },
                {
                    path: "userList",
                    component: userList
                },
                {
                    path: "business",
                    component: business
                },
                {
                    path: "subject",
                    component: subject
                },
                {
                    path: "question",
                    component: question
                },
            ]
        }
    ]
});

import NProgress from "nprogress"
import 'nprogress/nprogress.css'
//导航守卫，进入前守卫
router.beforeEach((to, from, next)=>{
    NProgress.start()
    next()
})
// 进入后守卫
router.afterEach((to, from)=>{
    NProgress.done()
    console.log(from);
})
export default router;