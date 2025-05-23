import request from '@/utils/request.js';


//查询标签
export const queryByCategoryIdService = async (categoryId) => {
    return await request.post('/subject/subject/label/queryByCategoryId', {categoryId})
};

//查询题目列表
export const getSubjectPageService = async (subjectData) => {
    return await request.post('/subject/subject/info/getSubjectPage',subjectData);
};

//查询题目详情
export const getSubjectByIdService = async (id) => {
    return await request.post('/subject/subject/info/getSubjectInfo',{id});
};

//查询点赞题目
export const getSubjectLikedPageService = async (subjectLiked) => {
    return await request.post('/subject/subject/liked/getSubjectLikedPage',subjectLiked);
};

//对题目进行点赞
export const addSubjectLikedService = async (subjectLiked) => {
    return await request.post('/subject/subject/liked/add',subjectLiked);
};


//发布评论
export const addCommentService = async (comment) => {
    return await request.post('/subject/subject/comments/addComment',comment);
};

//查询评论
export const getCommentPageService = async (comment) => {
    return await request.post('/subject/subject/comments/getAllComments',comment);
};

//排行榜
export const getContributeList = async () => {
    return await request.post('/subject/subject/info/getContributeList',);
};


//高亮搜索
export const querySubjectBySearchService = async (infoData) => {
    return await request.post('/subject/subject/info/querySubjectBySearch',infoData);
}

//添加题目
export const addSubjectService = async (subjectData) => {
    return await request.post('/subject/subject/info/add',subjectData);
}