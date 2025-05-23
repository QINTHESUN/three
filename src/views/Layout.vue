<script setup>
  import { ref, watch, computed } from "vue";
  import {
    Management,
    Promotion,
    UserFilled,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
  } from "@element-plus/icons-vue";
  import useUserInfoStore from "@/stores/userInfo.js";
  import { useRouter } from "vue-router";
  import { logoutService } from "@/api/auth.js";
  import { useTokenStore } from "@/stores/token.js";
  import { useRolePermissionStore } from "@/stores/rolePermission.js";

  const tokenStore = useTokenStore();
  const userInfoStore = useUserInfoStore();
  const router = useRouter();
  const rolePermissionStore = useRolePermissionStore();

  // 用户名
  const userName = ref(userInfoStore.userInfo.nickName);

  // 动态头像
  const avatarUrl = computed(() => userInfoStore.userInfo.avatar || "@/assets/default.png");

  // 监听用户信息变化
  watch(
      () => userInfoStore.userInfo,
      (newValue) => {
        userName.value = newValue.nickName;
      }
  );

  // 处理下拉菜单选项
  async function handleCommand(command) {
    switch (command) {
      case "profile":
        router.push("/user/UserInfo");
        break;
      case "avatar":
        router.push("/user/UserAvatar");
        break;
      case "password":
        router.push("/user/UserPassword");
        break;
      case "logout":
        try {
          await logoutService(userName.value);
          router.push("/login").then(() => {
            tokenStore.removeToken();
            userInfoStore.removeInfo();
            rolePermissionStore.removeRolePermission();
            window.location.reload(true);
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
        break;
    }
  }
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
        <!-- 普通用户菜单 -->
        <el-menu-item index="/subject/SubjectInfo">
          <el-icon>
            <Management />
          </el-icon>
          <span>题目</span>
        </el-menu-item>
        <el-menu-item index="/subject/SubjectLiked">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>收藏</span>
        </el-menu-item>
        <el-menu-item index="/subject/Rank">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>排行榜</span>
        </el-menu-item>
        <el-menu-item index="/subject/EsSearch">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>搜索</span>
        </el-menu-item>
        <el-menu-item index="/subject/AddSubject">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>添加题目</span>
        </el-menu-item>

        <!-- 管理员专属菜单 -->
        <template v-if="rolePermissionStore.rolePermission.includes('admin')">
          <el-sub-menu index="admin">
            <template #title>
              <el-icon>
                <UserFilled />
              </el-icon>
              <span>管理员功能</span>
            </template>
            <el-menu-item index="/admin/AdminAuth">管理用户</el-menu-item>
            <el-menu-item index="/admin/AdminCategory">管理分类</el-menu-item>
            <el-menu-item index="/admin/AdminPermission">管理权限</el-menu-item>
            <el-menu-item index="/admin/AdminRole">管理角色</el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>用户：<strong>{{ userName }}</strong></div>
        <el-dropdown @command="handleCommand" placement="bottom-end">
          <span class="el-dropdown__box">
            <!-- 使用动态头像 URL -->
            <el-avatar :src="avatarUrl" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="UserFilled">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>

      <!-- 底部区域 -->
      <el-footer>@社区脉动</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
  .layout-container {
    height: 100vh;

    .el-aside {
      background-color: #232323;

      &__logo {
        max-height: 100px;
        max-width: 100%;
        background: url("@/assets/cplogo.png") no-repeat center / contain;
        padding: 100px 0;
      }

      .el-menu {
        border-right: none;
      }
    }

    .el-header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-dropdown__box {
        display: flex;
        align-items: center;

        .el-icon {
          color: #999;
          margin-left: 10px;
        }

        &:active,
        &:focus {
          outline: none;
        }
      }
    }

    .el-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
    }
  }
</style>
