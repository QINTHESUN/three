<template>
  <div v-if="categoriesLoaded">
    <el-form :model="subjectData" label-width="120px">
      <el-form-item label="题目名称">
        <el-input v-model="subjectData.subjectName" placeholder="请输入题目名称"></el-input>
      </el-form-item>

      <el-form-item label="难度">
        <el-input-number v-model="subjectData.subjectDifficult" :min="1" :max="5" placeholder="难度等级"></el-input-number>
      </el-form-item>

      <el-form-item label="分值">
        <el-input-number v-model="subjectData.subjectScore" :min="1" placeholder="题目分值"></el-input-number>
      </el-form-item>

      <el-form-item label="解析">
        <el-input v-model="subjectData.subjectParse" type="textarea" placeholder="题目解析"></el-input>
      </el-form-item>

      <el-form-item label="题目类型">
        <el-select v-model="subjectData.subjectType" placeholder="请选择题目类型">
          <el-option label="单选题" :value="1"></el-option>
          <el-option label="多选题" :value="2"></el-option>
          <el-option label="判断题" :value="3"></el-option>
          <el-option label="简答题" :value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类">
        <el-select v-model="selectedCategoryId" @change="handleCategoryChange" placeholder="请选择分类">
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签">
        <el-select v-model="subjectData.labelIds" multiple placeholder="请选择标签">
          <el-option v-for="label in labels" :key="label.id" :label="label.name" :value="label.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 选项部分 -->
      <el-form-item v-if="subjectData.subjectType !== 4" label="选项列表">
        <div v-for="(option, index) in subjectData.optionList" :key="index" class="option-item">
          <el-input v-if="subjectData.subjectType !== 3" v-model="option.optionContent" placeholder="请输入选项内容"></el-input>
          <el-checkbox v-if="subjectData.subjectType === 2" v-model="option.isCorrect">正确选项</el-checkbox>
          <el-radio v-else-if="subjectData.subjectType === 1" v-model="option.isCorrect" :label="1">正确选项</el-radio>
          <el-button type="text" @click="removeOption(index)" class="remove-option">删除选项</el-button>
        </div>
        <el-button type="text" @click="addOption">添加选项</el-button>
      </el-form-item>

      <el-form-item v-if="subjectData.subjectType === 4" label="答案">
        <el-input v-model="subjectData.subjectAnswer" placeholder="请输入答案"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitSubject">添加题目</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    <p>正在加载分类数据...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { addSubjectService, queryByCategoryIdService } from '@/api/subject.js';
import { getAllCategoryService } from '@/api/admin';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const subjectData = ref({
      subjectName: '',
      subjectDifficult: 1,
      subjectType: 1,
      subjectScore: 2,
      subjectParse: '',
      categoryIds: [],
      labelIds: [],
      optionList: [],
      subjectAnswer: '',
    });

    const categories = ref([]);
    const labels = ref([]);
    const selectedCategoryId = ref(null);
    const categoriesLoaded = ref(false);

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
            handleCategoryChange(); // 获取对应小类并同步categoryIds
          }
          categoriesLoaded.value = true; // 数据加载完成标志
        } else {
          console.error('获取分类失败：', response.message);
        }
      } catch (error) {
        console.error('获取分类列表异常：', error);
      }
    };

    const fetchLabels = async () => {
      if (!selectedCategoryId.value) return;
      try {
        const response = await queryByCategoryIdService(selectedCategoryId.value);
        labels.value = response.data.map(item => ({
          id: item.id,
          name: item.labelName,
        }));
        if (labels.value.length > 0) {
          subjectData.value.labelIds = [labels.value[0].id];
        }
      } catch (error) {
        console.error('获取标签列表失败：', error);
      }
    };

    const handleCategoryChange = () => {
      subjectData.value.categoryIds = [selectedCategoryId.value];
      fetchLabels();
    };

    const addOption = () => {
      subjectData.value.optionList.push({
        optionType: subjectData.value.subjectType,
        optionContent: '',
        isCorrect: subjectData.value.subjectType === 3 ? 1 : 0,
      });
    };

    const removeOption = (index) => {
      subjectData.value.optionList.splice(index, 1);
    };

    const submitSubject = async () => {
      // 表单验证
      if (!subjectData.value.categoryIds || subjectData.value.categoryIds.length === 0) {
        ElMessage.error('请选择一个分类');
        return;
      }

      try {
        console.log(subjectData.value);
        const response = await addSubjectService(subjectData.value);
        ElMessage.success('题目添加成功');
        subjectData.value = {
          subjectName: '',
          subjectDifficult: 1,
          subjectType: 1,
          subjectScore: 2,
          subjectParse: '',
          categoryIds: [],
          labelIds: [],
          optionList: [],
          subjectAnswer: '',
        };
      } catch (error) {
        console.error('题目添加失败', error);
        ElMessage.error('题目添加失败');
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      subjectData,
      categories,
      labels,
      selectedCategoryId,
      categoriesLoaded,
      addOption,
      removeOption,
      submitSubject,
      handleCategoryChange,
    };
  },
};
</script>

<style scoped>
.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.remove-option {
  color: #f56c6c;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.el-button--primary:hover {
  background-color: #66b1ff;
}
</style>