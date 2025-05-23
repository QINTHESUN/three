// 导入vue-router
import {createRouter, createWebHistory} from "vue-router";
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import SubjectInfo from "@/views/subject/SubjectInfo.vue";
import SubjectLiked from "@/views/subject/SubjectLiked.vue";
import QuestionDetail from "@/views/subject/QuestionDetail.vue";
import UserAvatar from "@/views/user/UserAvatar.vue";
import UserPassword from "@/views/user/UserPassword.vue";
import UserInfo from "@/views/user/UserInfo.vue";
import Rank from '@/views/subject/Rank.vue'
import EsSearch from "@/views/subject/EsSearch.vue";
import AddSubject from "@/views/subject/AddSubject.vue";
import AdminAuth from "@/views/admin/AdminAuth.vue";
import AdminCategory from "@/views/admin/AdminCategory.vue";
import AdminPermission from "@/views/admin/AdminPermission.vue";
import AdminRole from "@/views/admin/AdminRole.vue";

//定义路由关系
//定义路由关系
// 定义路由关系
const routes = [
    {path: '/login', component: LoginVue},
    {
        path: '/', component: LayoutVue, redirect: '/subject/SubjectInfo',
        children: [
            {path: '/admin/AdminAuth' , component: AdminAuth},
            {path: '/admin/AdminCategory', component: AdminCategory},
            {path: '/admin/AdminPermission', component: AdminPermission},
            {path: '/admin/AdminRole', component: AdminRole},
            {path: '/subject/SubjectInfo', component: SubjectInfo},
            {path: '/subject/SubjectLiked', component: SubjectLiked},
            {path: '/subject/Rank', component: Rank},
            {path: '/subject/EsSearch', component: EsSearch},
            {path: '/subject/AddSubject', component: AddSubject},
            {
                path: '/subject/QuestionDetail/:id',
                component: QuestionDetail,
                name: 'QuestionDetail'  // 给 QuestionDetail 路由添加 name 属性
            },
            {path: '/user/UserAvatar', component: UserAvatar, meta: {hidden: true}},
            {path: '/user/UserInfo', component: UserInfo, meta: {hidden: true}},
            {path: '/user/UserPassword', component: UserPassword, meta: {hidden: true}},
        ]
    },
];


//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router

