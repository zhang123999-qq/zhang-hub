<template>
  <div class="user-settings">
    <div class="settings-container">
      <h1>账户设置</h1>
      
      <div class="settings-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="个人资料" name="profile">
            <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" placeholder="请输入用户名" />
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" type="email" placeholder="请输入邮箱" />
              </el-form-item>
              
              <el-form-item label="个人简介" prop="bio">
                <el-input 
                  v-model="profileForm.bio" 
                  type="textarea" 
                  placeholder="请输入个人简介" 
                  :rows="4"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleAvatarChange"
                  :show-file-list="false"
                  accept="image/*"
                >
                  <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
                  <el-button v-else type="primary">选择头像</el-button>
                </el-upload>
              </el-form-item>
              
              <el-form-item label="网站" prop="website">
                <el-input v-model="profileForm.website" placeholder="请输入个人网站地址" />
              </el-form-item>
              
              <el-form-item label="社交媒体">
                <div class="social-links">
                  <el-input 
                    v-model="profileForm.social.github" 
                    placeholder="GitHub 用户名" 
                    class="social-input"
                  />
                  <el-input 
                    v-model="profileForm.social.twitter" 
                    placeholder="Twitter 用户名" 
                    class="social-input"
                  />
                  <el-input 
                    v-model="profileForm.social.linkedin" 
                    placeholder="LinkedIn 用户名" 
                    class="social-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updateProfile">保存修改</el-button>
                <el-button @click="resetProfileForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="账户安全" name="security">
            <el-form :model="securityForm" :rules="securityRules" ref="securityFormRef" label-width="100px">
              <el-form-item label="当前密码" prop="currentPassword">
                <el-input v-model="securityForm.currentPassword" type="password" placeholder="请输入当前密码" />
              </el-form-item>
              
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="securityForm.newPassword" type="password" placeholder="请输入新密码" />
              </el-form-item>
              
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="securityForm.confirmPassword" type="password" placeholder="请确认新密码" />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="changePassword">修改密码</el-button>
                <el-button @click="resetSecurityForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="通知设置" name="notifications">
            <el-form :model="notificationForm" ref="notificationFormRef" label-width="150px">
              <el-form-item label="邮件通知">
                <el-switch v-model="notificationForm.email.enabled" />
              </el-form-item>
              
              <el-form-item label="文章评论通知" v-if="notificationForm.email.enabled">
                <el-switch v-model="notificationForm.email.comments" />
              </el-form-item>
              
              <el-form-item label="帖子回复通知" v-if="notificationForm.email.enabled">
                <el-switch v-model="notificationForm.email.replies" />
              </el-form-item>
              
              <el-form-item label="关注通知" v-if="notificationForm.email.enabled">
                <el-switch v-model="notificationForm.email.follows" />
              </el-form-item>
              
              <el-form-item label="系统通知" v-if="notificationForm.email.enabled">
                <el-switch v-model="notificationForm.email.system" />
              </el-form-item>
              
              <el-form-item label="站内通知">
                <el-switch v-model="notificationForm.site.enabled" />
              </el-form-item>
              
              <el-form-item label="文章评论通知" v-if="notificationForm.site.enabled">
                <el-switch v-model="notificationForm.site.comments" />
              </el-form-item>
              
              <el-form-item label="帖子回复通知" v-if="notificationForm.site.enabled">
                <el-switch v-model="notificationForm.site.replies" />
              </el-form-item>
              
              <el-form-item label="关注通知" v-if="notificationForm.site.enabled">
                <el-switch v-model="notificationForm.site.follows" />
              </el-form-item>
              
              <el-form-item label="系统通知" v-if="notificationForm.site.enabled">
                <el-switch v-model="notificationForm.site.system" />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updateNotifications">保存设置</el-button>
                <el-button @click="resetNotificationForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="隐私设置" name="privacy">
            <el-form :model="privacyForm" ref="privacyFormRef" label-width="150px">
              <el-form-item label="公开个人资料">
                <el-switch v-model="privacyForm.publicProfile" />
              </el-form-item>
              
              <el-form-item label="允许评论">
                <el-switch v-model="privacyForm.allowComments" />
              </el-form-item>
              
              <el-form-item label="允许私信">
                <el-switch v-model="privacyForm.allowMessages" />
              </el-form-item>
              
              <el-form-item label="允许关注">
                <el-switch v-model="privacyForm.allowFollows" />
              </el-form-item>
              
              <el-form-item label="搜索引擎索引">
                <el-switch v-model="privacyForm.allowIndexing" />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updatePrivacy">保存设置</el-button>
                <el-button @click="resetPrivacyForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="账户管理" name="account">
            <div class="account-management">
              <el-alert
                title="账户管理"
                type="info"
                :closable="false"
                show-icon
              />
              
              <div class="account-actions">
                <el-button type="warning" @click="deactivateAccount">停用账户</el-button>
                <el-button type="danger" @click="deleteAccount">删除账户</el-button>
              </div>
              
              <div class="account-info">
                <h3>账户信息</h3>
                <el-descriptions :column="2">
                  <el-descriptions-item label="账户创建时间">
                    {{ formatTime(user?.createdAt || '') }}
                  </el-descriptions-item>
                  <el-descriptions-item label="最后登录时间">
                    {{ formatTime(user?.lastLoginAt || '') }}
                  </el-descriptions-item>
                  <el-descriptions-item label="账户状态">
                    <el-tag type="success">活跃</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="角色">
                    <el-tag type="info">{{ user?.role || 'user' }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

// 路由
const router = useRouter()

// 状态管理
const userStore = useUserStore()
const authStore = useAuthStore()

// 响应式数据
const activeTab = ref('profile')
const user = ref<any>(null)

// 表单引用
const profileFormRef = ref()
const securityFormRef = ref()
const notificationFormRef = ref()
const privacyFormRef = ref()

// 个人资料表单
const profileForm = reactive({
  username: '',
  email: '',
  bio: '',
  avatar: '',
  website: '',
  social: {
    github: '',
    twitter: '',
    linkedin: ''
  }
})

// 密码表单
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 通知设置表单
const notificationForm = reactive({
  email: {
    enabled: true,
    comments: true,
    replies: true,
    follows: true,
    system: true
  },
  site: {
    enabled: true,
    comments: true,
    replies: true,
    follows: true,
    system: true
  }
})

// 隐私设置表单
const privacyForm = reactive({
  publicProfile: true,
  allowComments: true,
  allowMessages: true,
  allowFollows: true,
  allowIndexing: true
})

// 表单验证规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过 200 个字符', trigger: 'blur' }
  ]
}

const securityRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== securityForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 生命周期
onMounted(() => {
  loadUserProfile()
})

// 加载用户资料
const loadUserProfile = async () => {
  try {
    const userData = await userStore.getUserProfile()
    user.value = userData
    
    // 填充表单数据
    profileForm.username = userData.username
    profileForm.email = userData.email
    profileForm.bio = userData.bio || ''
    profileForm.avatar = userData.avatar || ''
    profileForm.website = userData.website || ''
    profileForm.social = { ...userData.social || {} }
    
    // 填充通知设置
    notificationForm.email = { ...userData.notifications?.email || notificationForm.email }
    notificationForm.site = { ...userData.notifications?.site || notificationForm.site }
    
    // 填充隐私设置
    privacyForm.publicProfile = userData.privacy?.publicProfile ?? true
    privacyForm.allowComments = userData.privacy?.allowComments ?? true
    privacyForm.allowMessages = userData.privacy?.allowMessages ?? true
    privacyForm.allowFollows = userData.privacy?.allowFollows ?? true
    privacyForm.allowIndexing = userData.privacy?.allowIndexing ?? true
  } catch (error) {
    ElMessage.error('加载用户资料失败')
    console.error('加载用户资料失败:', error)
  }
}

// 处理头像变更
const handleAvatarChange = (file: any) => {
  // 这里应该处理文件上传，暂时使用本地路径
  profileForm.avatar = URL.createObjectURL(file.raw)
}

// 更新个人资料
const updateProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.updateProfile(profileForm)
        ElMessage.success('个人资料更新成功')
        // 重新加载用户资料
        await loadUserProfile()
      } catch (error) {
        ElMessage.error('更新失败')
        console.error('更新失败:', error)
      }
    }
  })
}

// 更新密码
const changePassword = async () => {
  if (!securityFormRef.value) return
  
  await securityFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.changePassword({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
        ElMessage.success('密码修改成功')
        resetSecurityForm()
      } catch (error) {
        ElMessage.error('密码修改失败')
        console.error('修改密码失败:', error)
      }
    }
  })
}

// 更新通知设置
const updateNotifications = async () => {
  try {
    await userStore.updateNotifications(notificationForm)
    ElMessage.success('通知设置更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
    console.error('更新通知设置失败:', error)
  }
}

// 更新隐私设置
const updatePrivacy = async () => {
  try {
    await userStore.updatePrivacy(privacyForm)
    ElMessage.success('隐私设置更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
    console.error('更新隐私设置失败:', error)
  }
}

// 停用账户
const deactivateAccount = () => {
  ElMessageBox.confirm('确定要停用账户吗？停用后您将无法登录，但数据会被保留', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userStore.deactivateAccount()
      ElMessage.success('账户已停用')
      authStore.logout()
      router.push('/login')
    } catch (error) {
      ElMessage.error('操作失败')
      console.error('停用账户失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除账户
const deleteAccount = () => {
  ElMessageBox.confirm('确定要删除账户吗？此操作不可恢复，所有数据将被永久删除', '危险', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async () => {
    ElMessageBox.confirm('请再次确认，输入您的密码以验证身份', '身份验证', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入密码',
      inputType: 'password',
      type: 'danger'
    }).then(async (password) => {
      try {
        await userStore.deleteAccount(password)
        ElMessage.success('账户已删除')
        authStore.logout()
        router.push('/')
      } catch (error) {
        ElMessage.error('删除失败')
        console.error('删除账户失败:', error)
      }
    }).catch(() => {
      // 取消操作
    })
  }).catch(() => {
    // 取消操作
  })
}

// 重置表单
const resetProfileForm = () => {
  if (profileFormRef.value) {
    profileFormRef.value.resetFields()
  }
}

const resetSecurityForm = () => {
  if (securityFormRef.value) {
    securityFormRef.value.resetFields()
  }
}

const resetNotificationForm = () => {
  // 重置为默认值
  notificationForm.email = {
    enabled: true,
    comments: true,
    replies: true,
    follows: true,
    system: true
  }
  notificationForm.site = {
    enabled: true,
    comments: true,
    replies: true,
    follows: true,
    system: true
  }
}

const resetPrivacyForm = () => {
  // 重置为默认值
  privacyForm.publicProfile = true
  privacyForm.allowComments = true
  privacyForm.allowMessages = true
  privacyForm.allowFollows = true
  privacyForm.allowIndexing = true
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '未知'
  return new Date(time).toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
.user-settings {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 32px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 32px 0;
    text-align: center;
  }
}

.settings-tabs {
  margin-top: 24px;
}

.avatar-uploader {
  display: flex;
  align-items: center;
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.social-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  
  .social-input {
    flex: 1;
    min-width: 200px;
  }
}

.account-actions {
  margin: 24px 0;
  display: flex;
  gap: 16px;
  
  button {
    flex: 1;
  }
}

.account-info {
  margin-top: 32px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-settings {
    padding: 12px;
  }
  
  .settings-container {
    padding: 16px;
  }
  
  h1 {
    font-size: 20px !important;
  }
  
  .social-links {
    flex-direction: column;
    
    .social-input {
      min-width: auto;
    }
  }
  
  .account-actions {
    flex-direction: column;
  }
}
</style>
