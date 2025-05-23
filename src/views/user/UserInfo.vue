<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { getUserInfoService, updateInfoService } from '@/api/auth.js'; // 导入 API
  import { ElMessage } from 'element-plus';  // 引入 Element Plus 消息提示组件
  import { useTokenStore } from '@/stores/token.js';  // 引入 Token 状态管理
  import useUserInfoStore from "@/stores/userInfo.js";  // 引入用户信息状态管理
  import { useRouter } from 'vue-router'; // 导入 Vue Router

  // 初始化用户信息和表单数据
  const userInfo = ref({
    id: '',
    nickName: '',
    email: '',
    phone: '',
    avatar: '',
    introduce: '',
  });

  const updatedUserInfo = ref({ ...userInfo.value });

  const userInfoStore = useUserInfoStore();
  const router = useRouter(); // 获取 router 实例

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const response = await getUserInfoService(userInfoStore.userInfo.userName);  // 根据用户 ID 获取信息
      if (response.data) {
        userInfo.value = response.data;
        updatedUserInfo.value = { ...userInfo.value }; // 用于修改的表单数据
      } else {
        ElMessage.error('获取用户信息失败');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      ElMessage.error('获取用户信息失败');
    }
  };

  // 提交修改后的信息
  const updateUserInfo = async () => {
    try {
      const response = await updateInfoService(updatedUserInfo.value);
      if (response.success) {
        // 修改成功，更新用户信息并提示
        userInfo.value = { ...updatedUserInfo.value };
        userInfoStore.setInfo(userInfo.value);  // 更新状态管理中的用户信息
        ElMessage.success('修改成功');

        // 直接同步表单数据
        updatedUserInfo.value = { ...userInfo.value };
      } else {
        ElMessage.error('修改失败');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      ElMessage.error('修改失败');
    }
  };

  // 页面加载时获取用户信息
  onMounted(() => {
    getUserInfo();
  });

  // 监听 userInfoStore 的变化，以便更新界面
  watch(() => userInfoStore.userInfo, (newValue) => {
    updatedUserInfo.value = { ...newValue };
  });

  // 返回按钮的点击事件，跳转到主页面
  const goBack = () => {
    router.push('/'); // 跳转到主页面
  };
</script>

<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-title">用户信息</div>
    </el-header>

    <el-main>
      <!-- 添加返回按钮 -->
      <el-button @click="goBack" type="default" size="small">返回主页</el-button>

      <el-form :model="updatedUserInfo" label-width="100px" style="margin-top: 20px;">
        <el-form-item label="昵称">
          <el-input v-model="updatedUserInfo.nickName"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="updatedUserInfo.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="updatedUserInfo.phone"></el-input>
        </el-form-item>

        <el-form-item label="个人介绍">
          <el-input v-model="updatedUserInfo.introduce" type="textarea"></el-input>
        </el-form-item>

        <!-- 去除头像输入项 -->
        <!-- <el-form-item label="头像">
            <el-input v-model="updatedUserInfo.avatar"></el-input>
          </el-form-item> -->

        <el-button type="primary" @click="updateUserInfo">保存修改</el-button>
      </el-form>
    </el-main>

    <el-footer>@社区脉动</el-footer>
  </el-container>
</template>

<style scoped lang="scss">
  .layout-container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .header-title {
      font-size: 18px;
      padding: 20px;
      text-align: center;
    }

    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .el-button {
    margin-top: 20px;
  }
</style>
