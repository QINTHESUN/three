<template>
  <div class="user-management">
    <el-card>
      <el-row>
        <el-col>
          <el-input
              v-model="searchQuery"
              placeholder="搜索用户"
              clearable
              @clear="fetchUsers"
              @input="fetchUsers"
              style="width: 300px"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="fetchUsers">搜索</el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table
          :data="users"
          style="width: 100%; margin-top: 20px"
          border
          v-loading="loading"
      >
        <el-table-column prop="id" label="用户 ID" width="80" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="头像" width="120">
          <template #default="scope">
            <el-image
                style="width: 50px; height: 50px; border-radius: 50%;"
                :src="scope.row.avatar"
                fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="introduce" label="简介" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
                type="primary"
                size="small"
                @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button
                type="danger"
                size="small"
                @click="confirmDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          :current-page="pagination.page"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          style="margin-top: 20px"
      />
    </el-card>
    <!-- 删除确认弹窗 -->
    <el-dialog
        title="确认删除"
        :visible.sync="deleteDialogVisible"
        width="400px"
    >
      <span>确认删除用户 <strong>{{ deleteUser.nickName }}</strong> 吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteUserHandler">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllUserService, changeStatusService, deleteUserService } from '@/api/admin.js';

  export default {
    name: 'UserManagement',
    data() {
      return {
        users: [],
        searchQuery: '',
        loading: false,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        deleteDialogVisible: false,
        deleteUser: {},
      };
    },
    methods: {
      // 获取用户数据
      async fetchUsers() {
        try {
          this.loading = true;
          const res = await getAllUserService();
          if (res.success) {
            this.users = res.data.filter(user => user.isDeleted === 0); // 仅展示未删除用户
            this.pagination.total = res.data.length; // 根据返回值调整总数
          } else {
            this.$message.error(res.message || '获取用户列表失败');
          }
        } catch (err) {
          this.$message.error('获取用户列表失败');
        } finally {
          this.loading = false;
        }
      },
      // 切换用户状态
      async toggleUserStatus(user) {
        try {
          await changeStatusService({ id: user.id, status: user.status === 1 ? 0 : 1 });
          this.$message.success('状态更新成功');
          this.fetchUsers();
        } catch (err) {
          this.$message.error('状态更新失败');
        }
      },
      // 删除用户确认
      confirmDelete(user) {
        this.deleteUser = user;
        this.deleteDialogVisible = true;
      },
      // 删除用户
      async deleteUserHandler() {
        try {
          await deleteUserService({ id: this.deleteUser.id });
          this.$message.success('用户删除成功');
          this.fetchUsers();
          this.deleteDialogVisible = false;
        } catch (err) {
          this.$message.error('删除用户失败');
        }
      },
      // 处理分页
      handlePageChange(page) {
        this.pagination.page = page;
        this.fetchUsers();
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
</script>

<style scoped>
  .user-management {
    padding: 20px;
  }
</style>
