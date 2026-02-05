<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">创建音乐</h1>
    </div>

    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="form-container"
      >
        <el-form-item label="歌曲名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入歌曲名称" />
        </el-form-item>
        <el-form-item label="歌手名称" prop="artist">
          <el-input v-model="form.artist" placeholder="请输入歌手名称，多个歌手用逗号分隔" />
        </el-form-item>
        <el-form-item label="专辑名称" prop="album">
          <el-input v-model="form.album" placeholder="请输入专辑名称（可选）" />
        </el-form-item>
        <el-form-item label="类型" prop="genre">
          <el-select v-model="form.genre" placeholder="请选择类型" style="width: 100%">
            <el-option label="流行" value="pop" />
            <el-option label="摇滚" value="rock" />
            <el-option label="电子" value="electronic" />
            <el-option label="民谣" value="folk" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
          <el-upload
            class="cover-uploader"
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="form.cover_url" :src="form.cover_url" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="音乐文件" prop="file">
          <el-upload
            class="music-uploader"
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="true"
            :on-success="handleMusicSuccess"
            :before-upload="beforeMusicUpload"
            :on-progress="handleMusicProgress"
          >
            <el-button type="primary" :icon="Upload">选择音乐文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 MP3、WAV、FLAC 格式，最大 50MB</div>
            </template>
          </el-upload>
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
            <el-progress :percentage="uploadProgress" />
          </div>
        </el-form-item>
        <el-form-item label="发行时间" prop="release_date">
          <el-date-picker
            v-model="form.release_date"
            type="date"
            placeholder="选择发行时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述（可选）"
          />
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { createSong } from '@/api/song'
import { getAdminToken } from '@/utils/auth'
import { UPLOAD_LIMITS } from '@/utils/constants'

const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
const uploadProgress = ref(0)

const form = reactive({
  title: '',
  artist: '',
  album: '',
  genre: '',
  cover: null,
  cover_url: '',
  file: null,
  release_date: '',
  description: '',
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入歌曲名称', trigger: 'blur' }],
  artist: [{ required: true, message: '请输入歌手名称', trigger: 'blur' }],
  genre: [{ required: true, message: '请选择类型', trigger: 'change' }],
  file: [{ required: true, message: '请上传音乐文件', trigger: 'change' }]
}

// 开发环境使用代理，生产环境使用完整URL
const uploadAction = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/upload`
  : '/api/admin/upload'
const uploadHeaders = {
  Authorization: `Bearer ${getAdminToken()}`
}

const beforeCoverUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
  const isValidSize = file.size < UPLOAD_LIMITS.COVER_IMAGE.MAX_SIZE

  if (!isValidType) {
    ElMessage.error('封面图只能是 JPG/PNG 格式!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('封面图大小不能超过 5MB!')
    return false
  }
  return true
}

const handleCoverSuccess = (response) => {
  if (response.code === 0) {
    form.cover_url = response.data.url
    form.cover = response.data.path
    ElMessage.success('封面上传成功')
  }
}

const beforeMusicUpload = (file) => {
  const isValidType = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'].includes(file.type)
  const isValidSize = file.size < UPLOAD_LIMITS.MUSIC_FILE.MAX_SIZE

  if (!isValidType) {
    ElMessage.error('音乐文件只能是 MP3/WAV/FLAC 格式!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('音乐文件大小不能超过 50MB!')
    return false
  }
  return true
}

const handleMusicSuccess = (response) => {
  if (response.code === 0) {
    form.file = response.data.path
    uploadProgress.value = 100
    ElMessage.success('音乐文件上传成功')
  }
}

const handleMusicProgress = (event) => {
  uploadProgress.value = Math.round(event.percent)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const formData = new FormData()
        Object.keys(form).forEach(key => {
          if (form[key] !== null && form[key] !== '') {
            formData.append(key, form[key])
          }
        })
        const res = await createSong(formData)
        if (res.code === 0) {
          ElMessage.success('创建成功')
          router.push({ name: 'Songs' })
        }
      } catch (error) {
        ElMessage.error('创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed $border-color-base;
    border-radius: $border-radius-base;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: $transition-base;
    
    &:hover {
      border-color: $primary-color;
    }
  }
  
  .cover-image {
    width: 200px;
    height: 200px;
    display: block;
    object-fit: cover;
  }
  
  .cover-uploader-icon {
    font-size: 28px;
    color: $text-placeholder;
    width: 200px;
    height: 200px;
    @include center();
  }
}

.music-uploader {
  .upload-progress {
    margin-top: $spacing-sm;
    width: 400px;
  }
}
</style>

