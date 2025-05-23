import {defineStore} from "pinia";
import {ref} from "vue";

const useUserInfoStore = defineStore('userInfo', () => {
        //定义状态相关的内容
        const userInfo = ref({})

        const setInfo = (newInfo) => {
            userInfo.value = newInfo
        }

        const removeInfo = () => {
            userInfo.value = {}
        }

        return {userInfo, setInfo, removeInfo}
    }, {persistent: true}
)

export default useUserInfoStore;