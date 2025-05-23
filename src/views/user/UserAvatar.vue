<!-- components/AvatarUploader.vue -->
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <br/>
        <el-button type="primary" size="large" @click="triggerFileInput">
          选择图片
        </el-button>
        <el-button type="success" size="large" @click="handleUpload">
          上传头像
        </el-button>
        <el-button type="info" size="large" @click="goToHome">
          返回主页面
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  import { ref, computed, nextTick } from 'vue';
  import useUserInfoStore from '@/stores/userInfo.js';
  import { ElMessage } from 'element-plus';
  import { uploadAvatarService, updateInfoService } from '@/api/auth.js';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const userInfoStore = useUserInfoStore();
  const avatarUrl = computed(() => userInfoStore.userInfo.avatar);
  const file = ref(null);
  const imgUrl = ref(avatarUrl.value || 'src/assets/default.png');
  const uploadRef = ref();

  const uploadSuccess = (result) => {
    imgUrl.value = result.data;
  };

  const handleChange = (fileObj, fileList) => {
    const selectedFile = fileObj.raw; // 获取原始文件对象
    if (!selectedFile) {
      ElMessage.error('请选择文件');
      return;
    }

    // 检查文件类型
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
      ElMessage.error('请选择有效的图片文件');
      return;
    }

    // 检查文件大小
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      ElMessage.error('文件大小不能超过5MB');
      return;
    }

    // 设置预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      imgUrl.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);

    file.value = selectedFile; // 更新文件引用
  };

  const triggerFileInput = () => {
    nextTick(() => {
      const fileInput = uploadRef.value?.$el.querySelector('input');
      if (fileInput) {
        fileInput.click();
      } else {
        ElMessage.error('文件输入元素未找到');
      }
    });
  };

  const handleUpload = async () => {
    if (!file.value) {
      ElMessage.error('请选择文件');
      return;
    }

    const uniqueFileName = `${Date.now()}-${file.value.name}`;
    try {
      const result = await uploadAvatarService(file.value, uniqueFileName);
      console.log('uploadAvatarService result:', result);
      if (result) {
        ElMessage.success('头像上传成功');
        const newAvatarUrl = result;
        userInfoStore.setInfo({ ...userInfoStore.userInfo, avatar: newAvatarUrl });

        // 更新用户信息
        const updatedUserInfo = { ...userInfoStore.userInfo, avatar: newAvatarUrl };
        console.log('updatedUserInfo:', updatedUserInfo);
        const updateResult = await updateInfoService(updatedUserInfo);
        if (updateResult.success) {
          ElMessage.success('头像信息更新成功');
          uploadSuccess(result);
        } else {
          ElMessage.error('头像信息更新失败');
        }
      } else {
        ElMessage.error('头像上传失败');
      }
    } catch (error) {
      ElMessage.error('上传过程中出错');
    }
  };

  const goToHome = () => {
    router.push('/');
  };
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 50%;
        cursor: pointer;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }
    }
  }
</style>