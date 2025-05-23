<template>
  <div>
    <!-- 题目详情内容 -->
    <h1>{{ questionDetail.subjectName || '无题目' }}</h1>
    <p><strong>题目类型:</strong> {{ subjectTypeText }}</p>
    <p><strong>难度:</strong> {{ difficultyText }}</p>
    <p><strong>题目解析:</strong> {{ questionDetail.subjectParse || '无解析' }}</p>

    <!-- 题目选项或答案展示 -->
    <div v-if="questionDetail.subjectType === 1 || questionDetail.subjectType === 2 || questionDetail.subjectType === 3">
      <strong>选项:</strong>
      <ul>
        <li v-for="(option, index) in questionDetail.optionList" :key="index">
          {{ option.optionContent }} <span v-if="option.isCorrect">(正确)</span>
        </li>
      </ul>
    </div>
    <div v-if="questionDetail.subjectType === 4">
      <p><strong>答案:</strong> {{ questionDetail.subjectAnswer || '无答案' }}</p>
    </div>

    <!-- 标签显示 -->
    <div>
      <strong>标签:</strong>
      <ul>
        <li v-for="(label, index) in questionDetail.labelName" :key="index">
          {{ label }}
        </li>
      </ul>
    </div>

    <!-- 点赞功能 -->
    <p><strong>点赞:</strong> <span v-if="questionDetail.liked">已点赞</span><span v-else>未点赞</span></p>
    <p><strong>点赞数:</strong> {{ questionDetail.likedCount }}</p>
    <button @click="toggleLike">{{ questionDetail.liked ? '取消点赞' : '点赞' }}</button>
    <button @click="goBack">返回列表</button>

    <!-- 评论列表 -->
    <div>
      <h2>评论</h2>
      <!-- 如果没有评论，显示提示 -->
      <div v-if="comments.length === 0">
        <p>暂无评论</p>
      </div>
      <ul v-else>
        <li v-for="comment in comments" :key="comment.id">
          <p><strong>{{ comment.userId }}:</strong> {{ comment.content }}</p>
          <p><small>{{ formatDate(comment.createdAt) }}</small></p>

          <!-- 回复列表 -->
          <ul v-if="comment.replies">
            <li v-for="reply in comment.replies" :key="reply.id">
              <p><strong>{{ reply.userId }}:</strong> {{ reply.content }}</p>
              <p><small>{{ formatDate(reply.createdAt) }}</small></p>
            </li>
          </ul>

          <!-- 回复输入框 -->
          <input v-model="replyContent[comment.id]" placeholder="回复评论" />
          <button @click="addReply(comment.id)">回复</button>
        </li>
      </ul>
    </div>

    <!-- 新评论输入框 -->
    <div>
      <h3>添加新评论</h3>
      <input v-model="newCommentContent" placeholder="写下你的评论..." />
      <button @click="addComment">发表评论</button>
    </div>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import {getSubjectByIdService, addSubjectLikedService, addCommentService, getCommentPageService} from '@/api/subject';

  const route = useRoute();
  const router = useRouter();

  const questionDetail = ref({});  // 题目详情
  const difficultyText = ref("");  // 难度文本
  const subjectTypeText = ref("");  // 题目类型文本
  const comments = ref([]);  // 评论列表
  const newCommentContent = ref("");  // 新评论内容
  const replyContent = ref({});  // 回复内容（键为评论ID）

  // 获取题目详情
  const fetchQuestionDetail = async () => {
    try {
      const questionId = route.params.id;
      const response = await getSubjectByIdService(questionId);
      if (response.data) {
        questionDetail.value = response.data;
        setDifficultyText();
        setSubjectTypeText();
      }
    } catch (error) {
      console.error('获取题目详情失败:', error);
    }
  };

  // 获取评论列表
  const fetchComments = async () => {
    if (!questionDetail.value.id) {
      console.error('题目ID为空，无法获取评论');
      return;
    }
    try {
      const response = await getCommentPageService({ topicId: questionDetail.value.id });
      if (response.success) {
        comments.value = response.data;  // 更新评论列表
      } else {
        console.error('获取评论失败:', response.message);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const addReply = async (parentId) => {
    if (!replyContent.value[parentId]) return;
    try {
      const response = await addCommentService({
        topicId: questionDetail.value.id,
        content: replyContent.value[parentId],
        parentId: parentId,
      });

      if (response.success) {
        replyContent.value[parentId] = "";  // 清空回复框
        fetchComments();  // 刷新评论列表
      } else {
        // 如果返回的 data 是字符串，表示错误消息，显示该错误
        if (typeof response.data === 'string') {
          alert(`回复失败: ${response.data}`);  // 显示错误消息
        } else {
          alert(`回复评论失败: ${response.message || '未知错误'}`);
        }
      }
    } catch (error) {
      console.error("回复评论失败:", error);
      alert(`系统错误: 无法回复评论，请稍后再试`);
    }
  };

  const addComment = async () => {
    if (!newCommentContent.value) return;
    try {
      const response = await addCommentService({
        topicId: questionDetail.value.id,
        content: newCommentContent.value,
      });

      if (response.success) {
        newCommentContent.value = "";  // 清空输入框
        fetchComments();  // 刷新评论列表
      } else {
        // 如果返回的 data 是字符串，表示错误消息，显示该错误
        if (typeof response.data === 'string') {
          alert(`发表评论失败: ${response.data}`);  // 显示错误消息
        } else {
          alert(`发表评论失败: ${response.message || '未知错误'}`);
        }
      }
    } catch (error) {
      console.error("发表评论失败:", error);
      alert(`系统错误: 无法发表评论，请稍后再试`);
    }
  };



  // 点赞功能
  const toggleLike = async () => {
    try {
      const newStatus = questionDetail.value.liked ? 0 : 1;
      const response = await addSubjectLikedService({
        subjectId: questionDetail.value.id,
        status: newStatus,
      });
      if (response.success) {
        questionDetail.value.liked = newStatus === 1;
        questionDetail.value.likedCount += newStatus === 1 ? 1 : -1;
      }
    } catch (error) {
      console.error("点赞操作失败:", error);
    }
  };

  // 格式化日期
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  // 设置难度文本
  const setDifficultyText = () => {
    switch (questionDetail.value.subjectDifficult) {
      case 1:
        difficultyText.value = '简单';
        break;
      case 2:
        difficultyText.value = '中等';
        break;
      case 3:
        difficultyText.value = '困难';
        break;
      default:
        difficultyText.value = '未知';
    }
  };

  // 设置类型文本
  const setSubjectTypeText = () => {
    switch (questionDetail.value.subjectType) {
      case 1:
        subjectTypeText.value = '单选';
        break;
      case 2:
        subjectTypeText.value = '多选';
        break;
      case 3:
        subjectTypeText.value = '判断';
        break;
      case 4:
        subjectTypeText.value = '简答';
        break;
      default:
        subjectTypeText.value = '未知';
    }
  };

  // 返回按钮
  const goBack = () => {
    router.back();  // 返回上一页
  };

  // 页面加载时获取题目详情和评论列表
  onMounted(() => {
    fetchQuestionDetail().then(() => {
      fetchComments();  // 确保题目详情加载完成后加载评论
    });
  });
</script>

<style scoped>
  h1 {
    color: #333;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }

  button {
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  ul {
    padding-left: 20px;
  }

  li {
    list-style-type: none;
  }
</style>
