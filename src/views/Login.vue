<template>
  <div class="login-container">
    <!-- 登录标题 -->
    <h1>微信扫码登录</h1>

    <!-- 登录二维码提示 -->
    <p>请使用微信扫描下方二维码完成登录：</p>

    <!-- 显示二维码 -->
    <img :src="qrcodeSrc" alt="微信登录二维码" />

    <!-- 需要验证码时，显示验证码输入框 -->
    <div v-if="showVerification">
      <p>向公众号发送：验证码 即可获取登录验证码</p>
      <p>输入验证码:</p>
      <input v-model="verificationCode" type="text" placeholder="请输入验证码" />

      <!-- 验证按钮，点击后触发验证码验证 -->
      <button @click="handleVerify" :disabled="isVerifying">验证</button>
    </div>

    <!-- 当不需要验证码时，显示获取验证码按钮 -->
    <button v-else @click="getVerificationCode" :disabled="isVerifying">输入验证码</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';  // 引入 Vue 响应式变量
  import { wxLogin, getUserInfoService } from '@/api/auth.js';  // 引入后台接口服务
  import { ElMessage } from 'element-plus';  // 引入 Element Plus 消息提示组件
  import { useRouter } from 'vue-router';  // 引入路由功能
  import { useTokenStore } from "@/stores/token.js";  // 引入 Token 状态管理
  import useUserInfoStore from "@/stores/userInfo.js";  // 引入用户信息状态管理
  import {getUserRoleService} from '@/api/admin.js'
  import {useRolePermissionStore} from '@/stores/rolePermission.js'

  // 初始化路由、Token 存储、用户信息存储
  const route = useRouter();
  const tokenStore = useTokenStore();
  const userInfoStore = useUserInfoStore();
  const rolePermissionStore = useRolePermissionStore();


  // 控制二维码的路径
  const qrcodeSrc = ref('src/assets/wx.jpg');

  // 控制验证码输入框是否显示
  const showVerification = ref(false);

  // 存储验证码输入值
  const verificationCode = ref('');

  // 控制按钮是否处于正在验证状态
  const isVerifying = ref(false);

  // 点击“输入验证码”按钮时，显示验证码输入框
  const getVerificationCode = () => {
    showVerification.value = true;
  };

  // 点击“验证”按钮时，调用微信登录接口进行验证
  const handleVerify = async () => {
    if (isVerifying.value) return; // 防止重复请求
    isVerifying.value = true;

    try {
      // 调用微信登录接口，传入验证码进行验证
      const result = await wxLogin(verificationCode.value);

      // 检查 result.data 是否存在，并且 tokenValue 和 loginId 是否有效
      if (result.data.tokenValue && result.data.loginId) {
        const tokenValue = result.data.tokenValue;
        const loginId = result.data.loginId;
        var tokenName = result.data.tokenName;
        console.log("Sending userName:", loginId);

        console.log('Login successful:', result);

        // 存储 token
        tokenStore.setToken(tokenValue);
        console.log("tokenValue",tokenValue)

        const userInfoResponse = await getUserInfoService(loginId);
        console.log("Received userInfo:", userInfoResponse)

        // 如果成功获取用户信息，则存储用户信息并跳转到主页
        if (userInfoResponse.data) {
          userInfoStore.setInfo(userInfoResponse.data);
          console.log("User info stored successfully", userInfoResponse.data)
          console.log("userInfoStore",userInfoStore)
          console.log("用户名", userInfoResponse.data.userName)
          const userRole = await getUserRoleService(userInfoResponse.data.userName);
          console.log("userRole",userRole)

          rolePermissionStore.setRolePermission(userRole)
          console.log("pinia中的权限",rolePermissionStore.rolePermission)
          //console.log()
          ElMessage.success('登录成功');
          route.push('/');  // 跳转到主页
        } else {
          ElMessage.error('获取用户信息失败');
        }
      } else {
        ElMessage.error('登录失败，请确认登录数据是否正确');
      }
    } catch (error) {
      console.error('Login failed:', error);
      ElMessage.error('登录过程发生错误，请稍后再试');
    } finally {
      isVerifying.value = false;  // 结束验证状态
    }


  };

</script>

<style scoped>
  /* 登录容器样式 */
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f2f5;
  }

  /* 标题和提示文字颜色 */
  h1, p {
    color: #333;
  }

  /* 二维码图片样式 */
  img {
    width: 200px;
  }

  /* 输入框和按钮的样式 */
  input, button {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* 按钮默认样式 */
  button {
    background-color: #1890ff;
    color: white;
    cursor: pointer;
  }

  /* 按钮禁用时的样式 */
  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  /* 按钮悬浮时的样式 */
  button:hover {
    background-color: #40a9ff;
  }
</style>
