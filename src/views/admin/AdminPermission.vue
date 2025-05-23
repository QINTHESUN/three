<template>
  <div>
    <!-- 主内容 -->
    <el-card>
      <div class="header">
        <el-button type="primary" @click="openDialog('add')">添加权限</el-button>
      </div>
      <!-- 权限表格 -->
      <el-table :data="permissionList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="permissionKey" label="唯一标识" />
        <el-table-column prop="menuUrl" label="菜单URL" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusFormatter"
        />
        <el-table-column
          prop="type"
          label="类型"
          :formatter="typeFormatter"
        />
        <el-table-column
          prop="show"
          label="展示状态"
          :formatter="showFormatter"
        />
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
              @click="deletePermission(scope.row.id)"
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
      <el-form ref="permissionForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="唯一标识" prop="permissionKey">
          <el-input v-model="formData.permissionKey" placeholder="请输入唯一标识" />
        </el-form-item>
        <el-form-item label="菜单URL" prop="menuUrl">
          <el-input v-model="formData.menuUrl" placeholder="请输入菜单URL" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="0" />
            <el-option label="禁用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级ID" prop="parentId">
          <el-input v-model="formData.parentId" placeholder="请输入父级ID" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="菜单" :value="0" />
            <el-option label="操作" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="展示状态" prop="show">
          <el-select v-model="formData.show" placeholder="请选择是否展示">
            <el-option label="展示" :value="0" />
            <el-option label="隐藏" :value="1" />
          </el-select>
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
  queryAllPermission,
  addPermissionService,
  updatePermissionService,
  deletePermissionService,
} from "@/api/admin";

export default {
  name: "PermissionManagement",
  data() {
    return {
      permissionList: [],
      dialogVisible: false,
      dialogTitle: "",
      formData: {
        id: null,
        name: "",
        permissionKey: "",
        menuUrl: "",
        icon: "",
        status: 0,
        parentId: 0,
        type: 0,
        show: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
        permissionKey: [{ required: true, message: "请输入唯一标识", trigger: "blur" }],
        menuUrl: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
        icon: [{ required: true, message: "请输入图标URL", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        parentId: [{ required: true, message: "请输入父级ID", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        show: [{ required: true, message: "请选择展示状态", trigger: "change" }],
      },
      actionType: "add",
    };
  },
  methods: {
    async fetchPermissionList() {
      try {
        const response = await queryAllPermission();
        if (response.success) {
          this.permissionList = response.data;
        } else {
          this.$message.error("获取权限列表失败");
        }
      } catch (error) {
        console.error("获取权限列表时出错：", error);
        this.$message.error("获取权限列表时发生错误");
      }
    },
    openDialog(action, row = {}) {
      this.actionType = action;
      this.dialogTitle = action === "add" ? "添加权限" : "编辑权限";
      this.formData = action === "edit"
        ? { ...row }
        : { id: null, name: "", permissionKey: "", menuUrl: "", icon: "", status: 0, parentId: 0, type: 0, show: 0 };
      this.dialogVisible = true;
    },
    resetDialog() {
      this.formData = { id: null, name: "", permissionKey: "", menuUrl: "", icon: "", status: 0, parentId: 0, type: 0, show: 0 };
      this.actionType = "add";
    },
    async handleSubmit() {
      const form = this.$refs.permissionForm;
      form.validate(async (valid) => {
        if (valid) {
          const service =
            this.actionType === "add"
              ? addPermissionService
              : updatePermissionService;
          try {
            const response = await service(this.formData);
            if (response.success) {
              this.$message.success(`${this.actionType === "add" ? "添加" : "编辑"}成功`);
              this.dialogVisible = false;
              this.fetchPermissionList();
            } else {
              this.$message.error(`${this.actionType === "add" ? "添加" : "编辑"}失败`);
            }
          } catch (error) {
            console.error("提交表单时出错：", error);
            this.$message.error("提交权限时发生错误");
          }
        } else {
          this.$message.warning("请修正表单中的错误");
        }
      });
    },
    async deletePermission(id) {
      try {
        await this.$confirm("确认删除此权限吗？", "提示", { type: "warning" });
        const response = await deletePermissionService({ id });
        if (response.success) {
          this.$message.success("删除成功");
          this.fetchPermissionList();
        } else {
          this.$message.error("删除失败");
        }
      } catch (error) {
        console.error("删除权限时出错：", error);
        this.$message.info("取消删除");
      }
    },
    statusFormatter(row) {
      return row.status === 0 ? "启用" : "禁用";
    },
    typeFormatter(row) {
      return row.type === 0 ? "菜单" : "操作";
    },
    showFormatter(row) {
      return row.show === 0 ? "展示" : "隐藏";
    },
  },
  mounted() {
    this.fetchPermissionList();
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}
</style>
