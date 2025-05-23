<template>
  <div class="container">
    <h1>题目列表</h1>

    <!-- 大类和小类选择区域 -->
    <div class="card category-section">
      <h3>大类</h3>
      <ul>
        <li v-for="category in categories" :key="category.id">
          <a href="#"
             @click.prevent="selectCategory(category.id)"
             :class="{ active: category.id === selectedCategoryId }">
            {{ category.name }}
          </a>
        </li>
      </ul>

      <h3 v-if="selectedCategoryId">小类</h3>
      <ul v-if="selectedCategoryId">
        <li v-for="label in labels" :key="label.id">
          <a href="#"
             @click.prevent="selectLabel(label.id)"
             :class="{ active: label.id === selectedLabelId }">
            {{ label.name }}
          </a>
        </li>
      </ul>
    </div>

    <!-- 题目列表 -->
    <div class="card question-list">
      <ul :key="currentPage">
        <li v-if="paginatedQuestions.length === 0">暂无题目</li>
        <li v-for="question in paginatedQuestions" :key="question.id">
          <router-link :to="{ name: 'QuestionDetail', params: { id: question.id } }">
            {{ question.subjectName }} - {{ question.createdBy || '未知作者' }}
          </router-link>
        </li>
      </ul>

      <!-- 分页按钮 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed, onMounted} from 'vue';
  import {queryByCategoryIdService, getSubjectPageService} from '@/api/subject';
  import {getAllCategoryService} from '@/api/admin.js'

  const questions = ref([]);
  const currentPage = ref(1);
  const pageSize = 10;
  const totalQuestions = ref(0);
  const categories = ref([]);
  const labels = ref([]);
  const selectedCategoryId = ref('');
  const selectedLabelId = ref('');
  const subjectDifficult = ref(1); // 默认难度

  // 获取大类列表（从数据库查询）
  const fetchCategories = async () => {
    try {
      const response = await getAllCategoryService();
      if (response.success && Array.isArray(response.data)) {
        categories.value = response.data.map(item => ({
          id: item.id,
          name: item.categoryName, // 映射字段
        }));
        if (categories.value.length > 0) {
          selectedCategoryId.value = categories.value[0].id; // 默认选中第一个
          fetchLabels(); // 获取对应小类
        }
      } else {
        console.error('获取分类失败：', response.message);
      }
    } catch (error) {
      console.error('获取分类列表异常：', error);
    }
  };

  // 获取小类列表
  const fetchLabels = async () => {
    if (!selectedCategoryId.value) return;

    try {
      const response = await queryByCategoryIdService(selectedCategoryId.value);
      labels.value = response.data.map(item => ({
        id: item.id,
        name: item.labelName,
      }));
      if (labels.value.length > 0) {
        selectedLabelId.value = labels.value[0].id;
        fetchQuestions();
      }
    } catch (error) {
      console.error('获取小类列表失败：', error);
    }
  };

  // 获取题目列表
  const fetchQuestions = async () => {
    if (!selectedCategoryId.value || !selectedLabelId.value) return;

    try {
      const subjectInfoDto = {
        categoryId: selectedCategoryId.value,
        labelId: selectedLabelId.value,
        subjectDifficult: subjectDifficult.value,
        pageNo: currentPage.value,
        pageSize: pageSize,
      };
      const response = await getSubjectPageService(subjectInfoDto);
      questions.value = response.data.result || [];
      totalQuestions.value = response.data.total || 0;
    } catch (error) {
      console.error('获取题目列表失败：', error);
    }
  };

  // 选择大类
  const selectCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;
    selectedLabelId.value = ''; // 重置小类
    fetchLabels(); // 获取对应的小类
  };

  // 选择小类
  const selectLabel = (labelId) => {
    selectedLabelId.value = labelId;
    fetchQuestions();
  };

  // 分页数据
  const paginatedQuestions = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return questions.value.slice(startIndex, endIndex);
  });

  // 总页数
  const totalPages = computed(() => {
    return Math.ceil(totalQuestions.value / pageSize);
  });

  // 分页操作
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchQuestions();
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchQuestions();
    }
  };

  // 初始化
  onMounted(() => {
    fetchCategories(); // 页面加载时获取分类数据
  });
</script>


<style scoped>
  /* 样式保持不变 */
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

  .category-section ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .category-section li {
    margin-right: 15px;
    margin-bottom: 5px;
  }

  .category-section a {
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  .category-section a:hover {
    background-color: #e0e0e0;
  }

  .category-section a.active {
    font-weight: bold;
    color: #ffffff;
    background-color: #ff6600;
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
