<template>
  <div>
    <!-- 主内容 -->
    <el-card>
      <div class="header">
        <el-button type="primary" @click="openDialog('add')">添加角色</el-button>
      </div>
      <!-- 角色表格 -->
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleKey" label="角色唯一标识" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="openDialog('edit', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteRole(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @closed="resetDialog"
    >
      <el-form ref="roleForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色唯一标识" prop="roleKey">
          <el-input v-model="formData.roleKey" placeholder="请输入角色唯一标识" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryAllRole,
  addRoleService,
  updateRoleService,
  deleteRoleService,
} from "@/api/admin";

export default {
  name: "RoleManagement",
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      dialogTitle: "",
      formData: {
        id: null,
        roleName: "",
        roleKey: "",
      },
      rules: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        roleKey: [{ required: true, message: "请输入角色唯一标识", trigger: "blur" }],
      },
      actionType: "add",
    };
  },
  methods: {
    async fetchRoleList() {
      try {
        const response = await queryAllRole();
        if (response.success) {
          this.roleList = response.data;
        } else {
          this.$message.error("获取角色列表失败");
        }
      } catch (error) {
        console.error("获取角色列表时出错：", error);
        this.$message.error("获取角色列表时发生错误");
      }
    },
    openDialog(action, row = {}) {
      this.actionType = action;
      this.dialogTitle = action === "add" ? "添加角色" : "编辑角色";
      this.formData = action === "edit"
        ? { ...row }
        : { id: null, roleName: "", roleKey: "" };
      this.dialogVisible = true;
    },
    resetDialog() {
      this.formData = { id: null, roleName: "", roleKey: "" };
      this.actionType = "add";
    },
    async handleSubmit() {
      const form = this.$refs.roleForm;
      form.validate(async (valid) => {
        if (valid) {
          const service =
            this.actionType === "add"
              ? addRoleService
              : updateRoleService;
          try {
            const response = await service(this.formData);
            if (response.success) {
              this.$message.success(`${this.actionType === "add" ? "添加" : "编辑"}成功`);
              this.dialogVisible = false;
              this.fetchRoleList();
            } else {
              this.$message.error(`${this.actionType === "add" ? "添加" : "编辑"}失败`);
            }
          } catch (error) {
            console.error("提交表单时出错：", error);
            this.$message.error("提交角色时发生错误");
          }
        } else {
          this.$message.warning("请修正表单中的错误");
        }
      });
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除此角色吗？", "提示", { type: "warning" });
        const response = await deleteRoleService({ id });
        if (response.success) {
          this.$message.success("删除成功");
          this.fetchRoleList();
        } else {
          this.$message.error("删除失败");
        }
      } catch (error) {
        console.error("删除角色时出错：", error);
        this.$message.info("取消删除");
      }
    },
  },
  mounted() {
    this.fetchRoleList();
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}
</style>