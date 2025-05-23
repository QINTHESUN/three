import request from '@/utils/request.js';

// 微信扫码登录服务
export const wxLogin = async (validCode) => {
        // 拼接正确的请求 URL，并在请求体中传递 validCode
        const response =
            await request.post(`/auth/auth/user/doLogin?validCode=${validCode}`, {
            validCode: validCode
        });
        return response;
};

//查询用户信息
export const getUserInfoService = async (userName) =>{
    return await request.post('/auth/auth/user/getInfo', {userName});
};


//退出登录
export const logoutService = async (userName) => {
    try {
        // 删除名为 satoken 的 cookie
        document.cookie = "satoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        // 清除本地存储的 token
        localStorage.removeItem('satoken');
        sessionStorage.removeItem('satoken');

        // 添加随机参数以防止缓存
        const params = { userName, _ts: Date.now() };

        const response = await request.post('/auth/auth/user/logOut', null, {
            params,  // 使用 params 传递查询参数
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        // 更新登录状态，重新获取 loginId
        // 此时可以跳转到登录页，或者刷新页面，确保会话信息更新
        return response; // 返回响应
    } catch (error) {
        console.error("Logout request failed:", error);
        throw error; // 如果请求失败，抛出错误
    }
};
//更改用户信息
export const updateInfoService = async (userInfo) =>{
    return await request.post('/auth/auth/user/updateInfo', userInfo);
}


//上传头像
export const uploadAvatarService = async (file, uniqueFileName) => {
    const formData = new FormData();
    formData.append('uploadFile', file);
    formData.append('bucket', 'cp-oss');
    formData.append('objectName', uniqueFileName);

    try {
        const response = await request.post('/oss/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        console.log("uploadAvatarService response:", response);

        // 检查 response.data 的内容，确保它是预期格式
        return response.data;  // 返回 response.data，假设它包含 { "data": "http://url" }
    } catch (error) {
        console.error('Error in uploadAvatarService:', error);
        throw error;
    }
};
