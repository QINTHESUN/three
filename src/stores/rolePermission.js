import { defineStore } from "pinia";
import { ref } from "vue";

export const useRolePermissionStore = defineStore(
    'rolePermission',
    () => {
        // 定义状态为数组
        const rolePermission = ref([]);

        // 设置新的权限数组
        const setRolePermission = (newRolePermission) => {
            if (Array.isArray(newRolePermission)) {
                rolePermission.value = newRolePermission;
            } else {
                console.error("Invalid rolePermission data: must be an array.");
            }
        };

        // 清空权限
        const removeRolePermission = () => {
            rolePermission.value = [];
        };

        return { rolePermission, setRolePermission, removeRolePermission };
    },
    { persistent: true } // 支持持久化存储
);
