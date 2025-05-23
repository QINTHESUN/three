import request from '@/utils/request.js';
//查询所有的题目分类
export const getAllCategoryService = async () => {
    return await request.post('/subject/subject/category/queryAllCategory');
}
//新增文章分类
// 新增文章分类
export const addCategoryService = async (category) => {
    // 仅提取后端需要的字段
    const { categoryName, categoryType, parentId } = category;
    return await request.post('/subject/subject/category/add', { categoryName, categoryType, parentId });
};

//修改文章分类
export const updateCategoryService = async (category) => {
    return await request.post('/subject/subject/category/update',category);
}

//删除文章分类
export const deleteCategoryService = async (category) => {
    return await request.post('/subject/subject/category/delete',category);
}

//添加分类标签
export const addTagService = async (label) => {
    return await request.post('/subject/subject/label/add',label);
}

//修改分类标签
export const updateTagService = async (label) => {
    return await request.post('/subject/subject/label/update',label);
}

//删除分类标签
export const deleteTagService = async (label) => {
    return await request.post('/subject/subject/label/delete',label);
}




//查找所有的用户
export const getAllUserService = async () => {
    return await request.post('/auth/auth/user/queryAllUser');
}
//启用禁用用户状态
export const changeStatusService = async (user) => {
    return await request.post('/auth/auth/user/changeStatus',user);
}

//删除用户
export const deleteUserService = async (user) => {
    return await request.post('/auth/auth/user/deleteUser',user);
}

//查看用户权限
export const getUserRoleService = async (userName) => {
    console.log('Sending request with userName:', userName);
    if (!userName) {
        throw new Error('用户名不能为空');
    }
    const response = await request.post(
        '/auth/permission/queryPermission',
        { userName },
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
}
//查询所有角色
export const  queryAllRole = async () => {
    return await request.post('/auth/role/queryAllRole');
}
//添加角色
export const addRoleService = async (role) => {
    return await request.post('/auth/role/add',role);
}
//修改角色
export const updateRoleService = async (role) => {
    return await request.post('/auth/role/update',role);
}
//删除角色
export const deleteRoleService = async (role) => {
    return await request.post('/auth/role/delete',role);
}
//查询所有权限
export const queryAllPermission = async () => {
    return await request.post('/auth/permission/queryAllPermission');
}
//添加权限
export const addPermissionService = async (permission) => {
    return await request.post('/auth/permission/addPermission',permission);
}
//修改权限
export const updatePermissionService = async (permission) => {
    return await request.post('/auth/permission/updatePermission',permission);
}
//删除权限
export const deletePermissionService = async (permission) => {
    return await request.post('/auth/permission/deletePermission',permission);
}