import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import HomePage from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import FrontPage from '@/pages/front/index'
Vue.use(Router,{
  mode:"history",
  routes: [
    route("/user/login",'/user/login',"Login"),
    route("/user/register",'/user/register',"register"),
    route("/front/articleContent",'/front/articleContent',"articleContent"),
    {
      path: '/',
      name: 'FrontPage',
      component: FrontPage,
      redirect: "/front/articleList",
      children: [
        route("/front/articleList","/front/articleList","articleList"),

        route("/front/friendLink",'/front/friendLink',"friendLink"),
        route("/front/about",'/front/about',"about"),
        route("/front/tags",'/front/tags',"tags"),
        route("/front/category",'/front/category',"category"),
        route("/front/timeline",'/front/timeline',"timeline"),
      ]
    },
    {
      path: '/admin',
      name: 'HomePage',
      component: HomePage,
      redirect: "/index/dashboard",
      children:[
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/items/normalLine","/items/NormalLine","NormalLine"),
        route("/user/member","/user/Member","member"),
        route("/items/order","/items/Order","order"),
        route("/user/roleManage","/user/RoleManage","roleManage"),
        route("/settings/theme","/settings/theme","theme"),
        route("/settings/systemLog","/settings/SystemLog","systemLog"),
        route("/settings/EmailConfig","/settings/EmailConfig","emailConfig"),
        route("/settings/friend_link","/settings/LinkConfig","linkConfig"),
        route("/settings/menu","/settings/Menu","menu"),

        route("/article/article_list","/article/articleList","article_list"),
        route("/article/edit_article","/article/editArticle","edit_article"),
        route("/article/category","/article/category","category"),
        route("/article/table","/article/table","table"),
        route("/user/personal_info","/user/personal_info","personal_info"),
        route("/article/comments","/article/comments","comments"),
        route("/operations/storageManage","/operations/storageManage","storageManage"),
        route("/monitor/errorlog","/monitor/errorlog","errorlog"),
        route("/monitor/server","/monitor/server","server"),
      ]
    },
    {
      path:'*',
      name: 'NotFound',
      component: NotFound,
      redirect: "/index/notFound",
      children:[
        route("/index/notFound","/NotFound","NotFound"),
      ]
    },  //全不匹配的情况下，返回404，路由按顺序从上到下，依次匹配
  ]
})

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}
