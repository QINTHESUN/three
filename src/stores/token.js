import {defineStore} from "pinia";
import {ref} from "vue";

export const useTokenStore
    = defineStore('satoken',
    () => {

    //定义描述token
    const satoken = ref('')

    //定义修改token的方法
    const setToken = (newToken) => {
        satoken.value = newToken
    }

    //定义移除token的方法
    const removeToken = () => {
        satoken.value = ''
    }

    return {
        satoken, setToken, removeToken
    }
},
    {
        persist: true   //持久化储存
    }
)