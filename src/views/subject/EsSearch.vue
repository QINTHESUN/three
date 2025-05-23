<template>
  <div>
    <!-- 搜索框 -->
    <div>
      <input v-model="keyWord" placeholder="请输入关键词" />
      <button @click="search">搜索</button>
    </div>

    <!-- 搜索结果 -->
    <div v-if="results.length > 0">
      <p>搜索结果：</p>
      <ul>
        <li v-for="item in results" :key="item.docId">
          <!-- 高亮显示题目和答案 -->
          <h3 v-html="item.subjectName" @click="goToDetail(item.subjectId)"></h3>
          <p v-html="item.subjectAnswer"></p>
        </li>
      </ul>
    </div>
    <p v-else>暂无结果</p>
  </div>
</template>

<script>
  import { querySubjectBySearchService } from '@/api/subject'; // 替换为实际的服务文件路径

  export default {
    data() {
      return {
        keyWord: '',
        results: [],
        pageNo: 1,
        pageSize: 10
      };
    },
    methods: {
      async search() {
        const infoData = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyWord: this.keyWord
        };

        const response = await querySubjectBySearchService(infoData);
        if (response.success) {
          this.results = response.data.result;
        } else {
          this.results = [];
        }
      },
      goToDetail(subjectId) {
        this.$router.push({ name: 'QuestionDetail', params: { id: subjectId } });
      }
    }
  };
</script>

<style scoped>
  input {
    padding: 8px;
    margin-right: 5px;
  }

  button {
    padding: 8px 12px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }

  h3 {
    cursor: pointer;
    color: #007bff;
  }

  h3:hover {
    text-decoration: underline;
  }
</style>
