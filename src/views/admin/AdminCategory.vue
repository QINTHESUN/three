<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getAllCategoryService,
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
  addTagService,
  updateTagService,
  deleteTagService,
} from '@/api/admin.js';
import { queryByCategoryIdService } from '@/api/subject';

// 分类列表
const categories = ref([]); // 分类数据
const selectedCategoryId = ref(null); // 当前选中的分类ID

// 标签列表
const tags = ref([]); // 当前分类下的标签数据

// 弹窗控制
const categoryDialogVisible = ref(false); // 分类管理弹窗
const tagDialogVisible = ref(false); // 标签管理弹窗

// 分类模型
const categoryModel = reactive({
  id: null, // 分类ID（编辑时需要）
  categoryName: '', // 分类名称
  categoryType: 1, // 分类类型（默认值为1）
  parentId: 0, // 父分类ID
});

// 标签模型
const tagModel = reactive({
  id: null, // 标签ID（编辑时需要）
  labelName: '', // 标签名称
  sortNum: 1, // 排序号
  categoryId: null, // 所属分类ID
});

// 表单校验规则
const categoryRules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  categoryType: [{ type: 'number', required: true, message: '请输入分类类型', trigger: 'change' }],
};

const tagRules = {
  labelName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  sortNum: [{ type: 'number', required: true, message: '请输入排序号', trigger: 'change' }],
};

// 加载所有分类数据
const loadCategories = async () => {
  try {
    const result = await getAllCategoryService();
    categories.value = result.data || []; // 确保为数组
    ElMessage.success('分类数据加载成功');
  } catch {
    categories.value = []; // 设置默认空数组
    ElMessage.error('分类数据加载失败');
  }
};

// 加载当前分类下的标签数据
const loadTags = async (category) => {
  try {
    selectedCategoryId.value = category.id || selectedCategoryId.value; // 确保选中的分类ID有效
    const result = await queryByCategoryIdService(selectedCategoryId.value);
    tags.value = result.data || []; // 确保为数组
    ElMessage.success('标签数据加载成功');
  } catch (error) {
    console.error(error);
    tags.value = []; // 设置默认空数组
    ElMessage.error('标签数据加载失败');
  }
};

// 提交操作抽象
const submitHandler = async (model, service, successMsg, dialogVisible, updateList) => {
  try {
    const result = await service(model);
    if (result && result.success) {
      const list = updateList() || []; // 添加默认值检查
      if (model.id) {
        // 更新操作：本地直接更新对应项
        const index = list.findIndex(item => item.id === model.id);
        if (index !== -1) Object.assign(list[index], model);
      } else {
        // 添加操作：本地添加新项
        const newItem = { ...model, id: new Date().getTime() }; // 使用时间戳模拟ID
        list.push(newItem);
      }
      ElMessage.success(successMsg);
      dialogVisible.value = false; // 关闭弹窗
      if (model === categoryModel) await loadCategories(); // 刷新分类数据
      if (model === tagModel) await loadTags({ id: selectedCategoryId.value }); // 刷新标签数据
    } else {
      throw new Error(result.message || `${successMsg}失败`);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message || `${successMsg}失败`);
  }
};

// 打开分类管理弹窗
const openCategoryDialog = (category = null) => {
  if (category) {
    Object.assign(categoryModel, category);
  } else {
    Object.assign(categoryModel, { id: null, categoryName: '', categoryType: 1, parentId: 0 });
  }
  categoryDialogVisible.value = true;
};

// 打开标签管理弹窗
const openTagDialog = (tag = null) => {
  if (tag) {
    Object.assign(tagModel, tag);
  } else {
    Object.assign(tagModel, { id: null, labelName: '', sortNum: 1, categoryId: selectedCategoryId.value });
  }
  tagDialogVisible.value = true;
};

// 删除分类
const deleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm('确认删除该分类及其下的所有标签吗？', '提示', { type: 'warning' });
    await deleteCategoryService({ id: category.id });
    categories.value = categories.value.filter(item => item.id !== category.id); // 删除本地数据
    ElMessage.success('分类删除成功');
    if (category.id === selectedCategoryId.value) {
      selectedCategoryId.value = null;
      tags.value = [];
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('分类删除失败');
  }
};

// 删除标签
const deleteTag = async (tag) => {
  try {
    await ElMessageBox.confirm('确认删除该标签吗？', '提示', { type: 'warning' });
    await deleteTagService({ id: tag.id });
    tags.value = tags.value.filter(item => item.id !== tag.id); // 删除本地数据
    ElMessage.success('标签删除成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('标签删除失败');
  }
};

// 初始化加载分类数据
onMounted(() => {
  loadCategories();
});
</script>

<template>
  <el-card>
    <template #header>
      <div>
        <span>分类与标签管理</span>
        <el-button type="primary" @click="openCategoryDialog()">添加分类</el-button>
      </div>
    </template>
    <el-row>
      <el-col :span="10">
        <el-table :data="categories" @row-click="loadTags" style="cursor: pointer;">
          <el-table-column prop="categoryName" label="分类名称" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="openCategoryDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCategory(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="14">
        <div v-if="selectedCategoryId">
          <div class="tag-header">
            <span>标签管理</span>
            <el-button type="primary" @click="openTagDialog()">添加标签</el-button>
          </div>
          <el-table :data="tags">
            <el-table-column prop="labelName" label="标签名称" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="openTagDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteTag(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-card>

  <!-- 分类管理弹窗 -->
  <el-dialog v-model="categoryDialogVisible" title="分类管理">
    <el-form :model="categoryModel" :rules="categoryRules" ref="categoryForm">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="categoryModel.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类类型" prop="categoryType">
        <el-input-number v-model="categoryModel.categoryType" :min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="categoryDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          submitHandler(
            categoryModel,
            categoryModel.id ? updateCategoryService : addCategoryService,
            categoryModel.id ? '分类修改成功' : '分类添加成功',
            categoryDialogVisible,
            () => categories.value
          )
        "
      >
        确定
      </el-button>
    </template>
  </el-dialog>

  <!-- 标签管理弹窗 -->
  <el-dialog v-model="tagDialogVisible" title="标签管理">
    <el-form :model="tagModel" :rules="tagRules" ref="tagForm">
      <el-form-item label="标签名称" prop="labelName">
        <el-input v-model="tagModel.labelName" placeholder="请输入标签名称" />
      </el-form-item>
      <el-form-item label="排序号" prop="sortNum">
        <el-input-number v-model="tagModel.sortNum" :min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="tagDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="
          submitHandler(
            tagModel,
            tagModel.id ? updateTagService : addTagService,
            tagModel.id ? '标签修改成功' : '标签添加成功',
            tagDialogVisible,
            () => tags.value
          )
        "
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
