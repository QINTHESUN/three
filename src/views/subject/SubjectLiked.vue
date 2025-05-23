<template>
  <div class="container">
    <h1>点赞题目列表</h1>

    <!-- 分页按钮 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>

    <!-- 点赞题目列表 -->
    <div class="card question-list">
      <ul :key="currentPage">
        <li v-if="paginatedQuestions.length === 0">暂无题目</li>
        <li v-for="question in paginatedQuestions" :key="question.id">
          <router-link
              :to="{ name: 'QuestionDetail', params: { id: question.subjectId } }">
            {{ question.subjectName }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 分页按钮 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getSubjectLikedPageService } from '@/api/subject'; // 引入查询点赞题目接口

  // 定义响应式数据
  const questions = ref([]);
  const currentPage = ref(1);
  const pageSize = 10;
  const totalQuestions = ref(0);
  const totalPages = ref(0);

  // 获取点赞题目列表
  const fetchLikedSubjects = async () => {
    try {
      const subjectLikedDto = {
        pageNo: currentPage.value,
        pageSize: pageSize
      };
      const response = await getSubjectLikedPageService(subjectLikedDto);
      if (response.success) {
        const data = response.data;
        questions.value = data.result || [];
        totalQuestions.value = data.total || 0;
        totalPages.value = data.totalPages || 0;
      } else {
        console.error("获取点赞题目列表失败");
      }
    } catch (error) {
      console.error('获取点赞题目列表失败:', error);
    }
  };

  // 计算分页后的题目列表
  const paginatedQuestions = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return questions.value.slice(startIndex, endIndex);
  });

  // 上一页
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchLikedSubjects();
    }
  };

  // 下一页
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchLikedSubjects();
    }
  };

  // 页面加载时获取点赞题目列表
  onMounted(() => {
    fetchLikedSubjects();
  });
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .card {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
  }

  .question-list ul {
    list-style-type: none;
    padding: 0;
  }

  .question-list li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }

  .question-list li a {
    color: #333;
    text-decoration: none;
  }

  .question-list li a:hover {
    text-decoration: underline;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .pagination button {
    background-color: #007bff;
    color: #ffffff;
    border: none;
    padding: 8px 16px;
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .pagination button:hover:not(:disabled) {
    background-color: #0056b3;
  }
</style>
