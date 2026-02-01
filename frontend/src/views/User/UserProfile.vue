<template>
  <div class="user-profile">
    <div class="profile-container">
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="!user" class="error-state">
        <el-empty description="用户不存在" />
        <el-button @click="goBack">返回首页</el-button>
      </div>
      
      <div v-else>
        <!-- 用户基本信息 -->
        <div class="user-header">
          <div class="user-avatar">
            <el-avatar :size="120" :src="user.avatar" />
          </div>
          
          <div class="user-info">
            <h1 class="username">{{ user.username }}</h1>
            <p class="bio">{{ user.bio || '该用户暂未设置个人简介' }}</p>
            
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">{{ user.stats.articles || 0 }}</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ user.stats.threads || 0 }}</span>
                <span class="stat-label">帖子</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ user.stats.resources || 0 }}</span>
                <span class="stat-label">资源</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ user.stats.reputation || 0 }}</span>
                <span class="stat-label">声望</span>
              </div>
            </div>
            
            <div class="user-actions">
              <el-button 
                v-if="!isCurrentUser" 
                type="primary" 
                @click="followUser"
                :loading="isFollowing"
              >
                {{ isFollowing ? '已关注' : '关注' }}
              </el-button>
              <el-button 
                v-if="isCurrentUser" 
                type="default" 
                @click="goToSettings"
              >
                编辑资料
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 内容标签页 -->
        <div class="content-tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="文章" name="articles">
              <div class="articles-list">
                <div 
                  v-for="article in userArticles" 
                  :key="article.id" 
                  class="article-item"
                  @click="goToArticle(article.slug)"
                >
                  <h3>{{ article.title }}</h3>
                  <div class="article-meta">
                    <span>{{ formatTime(article.createdAt) }}</span>
                    <span>{{ article.views }} 浏览</span>
                    <span>{{ article.likes }} 点赞</span>
                  </div>
                </div>
                
                <div v-if="userArticles.length === 0" class="empty-content">
                  <el-empty description="暂无文章" :image-size="100" />
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="帖子" name="threads">
              <div class="threads-list">
                <div 
                  v-for="thread in userThreads" 
                  :key="thread.id" 
                  class="thread-item"
                  @click="goToThread(thread.id)"
                >
                  <h3>{{ thread.title }}</h3>
                  <div class="thread-meta">
                    <span>{{ formatTime(thread.createdAt) }}</span>
                    <span>{{ thread.repliesCount }} 回复</span>
                    <span>{{ thread.viewsCount }} 浏览</span>
                  </div>
                </div>
                
                <div v-if="userThreads.length === 0" class="empty-content">
                  <el-empty description="暂无帖子" :image-size="100" />
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="资源" name="resources">
              <div class="resources-list">
                <div 
                  v-for="resource in userResources" 
                  :key="resource.id" 
                  class="resource-item"
                  @click="goToResource(resource.id)"
                >
                  <div class="resource-cover">
                    <img :src="resource.coverImage || defaultCover" :alt="resource.title" />
                  </div>
                  <div class="resource-info">
                    <h3>{{ resource.title }}</h3>
                    <div class="resource-meta">
                      <span>{{ formatTime(resource.createdAt) }}</span>
                      <span>{{ resource.downloads }} 下载</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="userResources.length === 0" class="empty-content">
                  <el-empty description="暂无资源" :image-size="100" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useBlogStore } from '@/stores/blog'
import { useForumStore } from '@/stores/forum'
import { useResourceStore } from '@/stores/resource'
import { useAuthStore } from '@/stores/auth'
import { Loading } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 状态管理
const userStore = useUserStore()
const blogStore = useBlogStore()
const forumStore = useForumStore()
const resourceStore = useResourceStore()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const user = ref<any>(null)
const userArticles = ref<any[]>([])
const userThreads = ref<any[]>([])
const userResources = ref<any[]>([])
const activeTab = ref('articles')
const isFollowing = ref(false)

// 计算属性
const username = computed(() => route.params.username as string)
const isCurrentUser = computed(() => {
  return authStore.user?.username === username.value
})

// 默认封面图
const defaultCover = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cybersecurity%20resource%20cover%20with%20lock%20icon%20and%20digital%20background&image_size=square'

// 生命周期
onMounted(() => {
  fetchUserProfile()
  fetchUserContent()
})

// 获取用户资料
const fetchUserProfile = async () => {
  loading.value = true
  try {
    user.value = await userStore.getUserProfile(username.value)
    // 检查是否已关注
    if (!isCurrentUser.value) {
      // 这里应该检查关注状态
      isFollowing.value = false
    }
  } catch (error) {
    ElMessage.error('加载用户资料失败')
    console.error('加载用户资料失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取用户内容
const fetchUserContent = async () => {
  try {
    // 获取用户文章
    const articles = await blogStore.getUserArticles(username.value)
    userArticles.value = articles
    
    // 获取用户帖子
    const threads = await forumStore.getUserThreads(username.value)
    userThreads.value = threads
    
    // 获取用户资源
    const resources = await resourceStore.getUserResources(username.value)
    userResources.value = resources
  } catch (error) {
    console.error('加载用户内容失败:', error)
  }
}

// 处理标签页点击
const handleTabClick = (tab: any) => {
  activeTab.value = tab.paneName
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 关注用户
const followUser = async () => {
  try {
    await userStore.followUser(username.value)
    isFollowing.value = !isFollowing.value
    ElMessage.success(isFollowing.value ? '关注成功' : '取消关注成功')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('关注操作失败:', error)
  }
}

// 跳转到设置页面
const goToSettings = () => {
  router.push('/settings')
}

// 跳转到文章详情
const goToArticle = (slug: string) => {
  router.push(`/blog/${slug}`)
}

// 跳转到帖子详情
const goToThread = (id: string) => {
  router.push(`/forum/thread/${id}`)
}

// 跳转到资源详情
const goToResource = (id: string) => {
  router.push(`/resources/${id}`)
}

// 返回首页
const goBack = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.user-profile {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .loading-icon {
      margin-right: 12px;
      font-size: 24px;
      color: #409eff;
    }
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    button {
      margin-top: 24px;
    }
  }
}

.user-header {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  
  .user-avatar {
    flex-shrink: 0;
  }
  
  .user-info {
    flex: 1;
    
    .username {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .bio {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }
    
    .user-stats {
      display: flex;
      gap: 32px;
      margin-bottom: 24px;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .stat-label {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      }
    }
    
    .user-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.content-tabs {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.articles-list,
.threads-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.article-item,
.thread-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
    transform: translateY(-2px);
  }
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }
  
  .article-meta,
  .thread-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #999;
  }
}

.resources-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.resource-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .resource-cover {
    height: 150px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .resource-info {
    padding: 16px;
    
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .resource-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #999;
    }
  }
}

.empty-content {
  padding: 48px 0;
  display: flex;
  justify-content: center;
}

// 响应式设计
@media (max-width: 768px) {
  .user-profile {
    padding: 12px;
  }
  
  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
  
  .user-stats {
    justify-content: center !important;
  }
  
  .content-tabs {
    padding: 16px;
  }
  
  .resources-list {
    grid-template-columns: 1fr;
  }
}
</style>
