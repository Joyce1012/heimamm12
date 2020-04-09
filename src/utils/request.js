import axios from "axios"
import { Message } from 'element-ui';

const instance = axios.create({
    baseURL: process.env.VUE_APP_URL,
    withcredentials: true
});

 // 添加请求拦截器
 instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //config所有请求的相关信息
    window.console.log("拦截的数据", config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // response所有返回的相关信息
    // window.console.log("响应的数据拦截", response)

    if (response.data.code == 200) {
        // 因为返回数据里面axios帮我们额外的包了一层data但实际我们基本不用，所以我们把它干掉
        return response.data;
    } else {
        // 提示用户错误
        // 出错了我们还有必要返回数据出去吗？
        //抛出一个错误，不要让后面代码执行
        //只要return了一个Promise.reject("error")后面的接口的.then就不会执行了
        Message.error(response.data.message)
        return Promise.reject("error");
    }
},function (error) {
    return Promise.reject(error);
});

export default instance