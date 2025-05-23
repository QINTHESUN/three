//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const instance = axios.create({baseURL})
import { ElMessage } from 'element-plus';

import {useTokenStore} from "@/stores/token.js";

import router from '@/router'
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 请求前回调
        // 添加 token
        const tokenStore = useTokenStore();
        if (tokenStore.satoken) {
            config.headers.satoken = tokenStore.satoken;  // 默认是 'satoken'
        }
        //console.log(config.headers.satoken)
        return config;
    },
    (error) => {
        // 请求错误回调
        Promise.reject(error);
    }
);


//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if (result.data.code === 200) {
            return result.data;
        }
        ElMessage.error(result.data.msg?result.data.msg:"服务异常")
        //异步操作的状态转换为失败
        return Promise.reject(result.data)
    },
    error => {
        if (error.response.status===401){
            ElMessage.error('请先登录')
            router.push('/login')
        }else {
            ElMessage.error('服务异常')
        }
        return Promise.reject(error)
    }
)

export default instance;