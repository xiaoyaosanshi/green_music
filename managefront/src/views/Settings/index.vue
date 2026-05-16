<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">系统配置</h1>
      <p class="page-description">系统基础配置和参数设置</p>
    </div>

    <el-card>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="basicForm" label-width="150px" style="max-width: 800px">
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.system_name" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="logo-uploader"
                :action="uploadAction"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
              >
                <img v-if="basicForm.logo_url" :src="basicForm.logo_url" class="logo-image" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input v-model="basicForm.description" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="basicForm.contact" />
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="basicForm.copyright" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="推荐算法配置" name="recommend">
          <el-form :model="recommendForm" label-width="150px" style="max-width: 800px">
            <el-form-item label="协同过滤权重">
              <el-input-number v-model="recommendForm.cf_weight" :min="0" :max="1" :step="0.1" />
            </el-form-item>
            <el-form-item label="推荐数量">
              <el-input-number v-model="recommendForm.recommend_count" :min="1" :max="50" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="内容审核配置" name="review">
          <el-form :model="reviewForm" label-width="150px" style="max-width: 800px">
            <el-form-item label="自动审核">
              <el-switch v-model="reviewForm.auto_review" />
            </el-form-item>
            <el-form-item label="敏感词库">
              <el-input v-model="reviewForm.sensitive_words" type="textarea" :rows="6" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getAdminToken } from '@/utils/auth'

const activeTab = ref('basic')

const basicForm = reactive({
  system_name: 'Green Music',
  logo_url: '',
  description: '',
  contact: '',
  copyright: ''
})

const recommendForm = reactive({
  cf_weight: 0.5,
  recommend_count: 10
})

const reviewForm = reactive({
  auto_review: true,
  sensitive_words: ''
})

// 开发环境使用代理，生产环境使用完整URL
const uploadAction = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/upload`
  : '/api/admin/upload'
const uploadHeaders = {
  Authorization: `Bearer ${getAdminToken()}`
}

const handleLogoSuccess = (response) => {
  if (response.code === 0) {
    basicForm.logo_url = response.data.url
  }
}
</script>

<style lang="scss" scoped>
.logo-uploader {
  :deep(.el-upload) {
    border: 1px dashed $border-color-base;
    border-radius: $border-radius-base;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    &:hover {
      border-color: $primary-color;
    }
  }
  
  .logo-image {
    width: 200px;
    height: 200px;
    display: block;
    object-fit: cover;
  }
  
  .logo-uploader-icon {
    font-size: 28px;
    color: $text-placeholder;
    width: 200px;
    height: 200px;
    @include center();
  }
}
</style>

