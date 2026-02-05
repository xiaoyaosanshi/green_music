<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Green Music</h1>
        <p>欢迎回来</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleSubmit">
        <el-form-item prop="identity">
          <el-input
            v-model="form.identity"
            placeholder="用户名或邮箱"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="handleSubmit" :loading="loading" block>
            登录
          </el-button>
        </el-form-item>
        <div class="login-footer">
          <el-button type="text" @click="goToRegister">还没有账号？立即注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  identity: '',
  password: ''
})

const rules = {
  identity: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      loading.value = true
      await userStore.login(form.identity, form.password)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/home'
      router.push(redirect)
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}

const goToRegister = () => {
  // TODO: 跳转到注册页
  ElMessage.info('注册功能开发中')
}
</script>

<style lang="scss" scoped>
.login-page {
  @include flex-center;
  min-height: 100vh;
  @include gradient-bg;
}

.login-container {
  width: 400px;
  padding: $spacing-xxl;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(155, 225, 93, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: $spacing-xxl;

  h1 {
    font-size: $font-size-xl;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    @include gradient-bg;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: $text-secondary;
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-lg;
}
</style>

