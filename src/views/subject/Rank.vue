<template>
  <div class="leaderboard-container">
    <h1>排行榜</h1>

    <div v-if="contributeList.length > 0" class="leaderboard">
      <ul>
        <li v-for="(user, index) in contributeList" :key="index" class="leaderboard-item">
          <div class="rank">{{ index + 1 }}</div>
          <img :src="user.createUserAvatar" alt="用户头像" class="avatar" />
          <div class="user-info">
            <div class="user-name">{{ user.createUser }}</div>
            <div class="subject-count">贡献题目数: {{ user.subjectCount }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-data">
      <p>暂无排行榜数据</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { getContributeList } from '@/api/subject'; // 引入你定义的获取排行榜数据的方法

  // 定义响应式数据
  const contributeList = ref([]);

  // 获取排行榜数据
  const fetchContributeList = async () => {
    try {
      const response = await getContributeList();
      if (response.data && Array.isArray(response.data)) {
        contributeList.value = response.data;
      } else {
        contributeList.value = [];
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
    }
  };

  // 页面加载时获取排行榜数据
  onMounted(() => {
    fetchContributeList();
  });
</script>

<style scoped>
  .leaderboard-container {
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .leaderboard {
    list-style-type: none;
    padding: 0;
  }

  .leaderboard-item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .rank {
    font-size: 18px;
    font-weight: bold;
    margin-right: 10px;
    width: 30px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .user-name {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .subject-count {
    font-size: 14px;
    color: #555;
  }

  .no-data {
    font-size: 16px;
    color: #888;
  }
</style>
