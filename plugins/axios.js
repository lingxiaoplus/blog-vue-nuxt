import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = "https://api.lingxiaomz.top"; // 设置axios的基础请求路径
axios.defaults.timeout = 8000; // 设置axios的请求时间
axios.defaults.withCredentials = true;
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 2000;

axios.loadData = async function (url) {
  const resp = await axios.get(url);
  return resp.data;
}

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么，例如加入token
  let token = localStorage.getItem("blog_login_token");
  if (token) {
    config.headers['blog-login-token'] = token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  console.log("拦截器请求错误",error);
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  // 在接收响应做些什么，例如跳转到登录页
  let token = response.headers['blog-login-token'];
  if (token){
    localStorage.setItem("blog_login_token",token);
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  if (error.response){
    //console.log("拦截器响应错误",error.response.data);
    if (error.response.data.code === 401 || error.response.status === 403){
      router.push("/user/login");
    }
  }
  return Promise.reject(error);
});

Vue.prototype.$http = axios;// 将axios添加到 Vue的原型，这样一切vue实例都可以使用该对象
import uiUtil from './UiUtil'
Vue.prototype.$uiUtil = uiUtil;
