<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h2>注册 CodeSecHub</h2>
        <p>加入我们的技术社区，一起成长！</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            placeholder="请输入用户名"
            required
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            required
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="请输入密码（至少8位）"
            required
            autocomplete="new-password"
            minlength="8"
          />
        </div>
        
        <div class="form-group">
          <label for="password2">确认密码</label>
          <input
            type="password"
            id="password2"
            v-model="formData.password2"
            placeholder="请再次输入密码"
            required
            autocomplete="new-password"
            minlength="8"
          />
        </div>
        
        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="formData.role">
            <option value="user">普通用户</option>
            <option value="writer">内容创作者</option>
          </select>
        </div>
        
        <div class="form-agreement">
          <input type="checkbox" id="agreement" v-model="agreement" required />
          <label for="agreement">我同意 CodeSecHub 的 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a></label>
        </div>
        
        <button type="submit" class="register-button" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
        
        <div class="form-footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  password2: '',
  role: 'user'
})

const agreement = ref(false)
const isLoading = ref(false)

const handleRegister = async () => {
  try {
    isLoading.value = true
    
    // 验证密码是否一致
    if (formData.value.password !== formData.value.password2) {
      throw new Error('两次输入的密码不一致')
    }
    
    const response = await authStore.register(formData.value)
    
    // 注册成功后跳转到首页
    router.push('/')
    
    // 显示成功消息
    alert('注册成功！欢迎加入 CodeSecHub')
  } catch (error: any) {
    alert(error.message || '注册失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  animation: slideIn 0.5s ease;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  input,
  select {
    padding: 12px 16px;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &::placeholder {
      color: #999;
    }
  }
  
  select {
    cursor: pointer;
  }
}

.form-agreement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  margin-top: 10px;
  
  input[type="checkbox"] {
    margin-top: 2px;
    cursor: pointer;
  }
  
  label {
    color: #666;
    flex: 1;
    
    a {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.register-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.form-footer {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
  
  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 30px 20px;
  }
  
  .register-header h2 {
    font-size: 20px;
  }
  
  .form-agreement {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
