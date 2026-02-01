<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理员仪表盘</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshStats">刷新数据</el-button>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-info">
            <h3>用户总数</h3>
            <p class="stat-value">{{ stats.users || 0 }}</p>
            <p class="stat-change" :class="{ positive: stats.userGrowth > 0, negative: stats.userGrowth < 0 }">
              {{ stats.userGrowth > 0 ? '+' : '' }}{{ stats.userGrowth }}% 较上月
            </p>
          </div>
          <div class="stat-icon user-icon">
            <el-icon><User /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-info">
            <h3>文章总数</h3>
            <p class="stat-value">{{ stats.articles || 0 }}</p>
            <p class="stat-change" :class="{ positive: stats.articleGrowth > 0, negative: stats.articleGrowth < 0 }">
              {{ stats.articleGrowth > 0 ? '+' : '' }}{{ stats.articleGrowth }}% 较上月
            </p>
          </div>
          <div class="stat-icon article-icon">
            <el-icon><Document /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-info">
            <h3>帖子总数</h3>
            <p class="stat-value">{{ stats.threads || 0 }}</p>
            <p class="stat-change" :class="{ positive: stats.threadGrowth > 0, negative: stats.threadGrowth < 0 }">
              {{ stats.threadGrowth > 0 ? '+' : '' }}{{ stats.threadGrowth }}% 较上月
            </p>
          </div>
          <div class="stat-icon thread-icon">
            <el-icon><ChatLineSquare /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-info">
            <h3>资源总数</h3>
            <p class="stat-value">{{ stats.resources || 0 }}</p>
            <p class="stat-change" :class="{ positive: stats.resourceGrowth > 0, negative: stats.resourceGrowth < 0 }">
              {{ stats.resourceGrowth > 0 ? '+' : '' }}{{ stats.resourceGrowth }}% 较上月
            </p>
          </div>
          <div class="stat-icon resource-icon">
            <el-icon><DataAnalysis /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 活动图表 -->
    <div class="activity-charts">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近30天活动趋势</span>
            <el-select v-model="chartType" size="small">
              <el-option label="用户注册" value="users" />
              <el-option label="文章发布" value="articles" />
              <el-option label="帖子发布" value="threads" />
              <el-option label="资源上传" value="resources" />
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <div v-if="loading" class="chart-loading">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span>加载中...</span>
          </div>
          <div v-else class="chart-content">
            <!-- 这里应该使用真实的图表库，暂时使用模拟数据 -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div 
                  v-for="(value, index) in chartData" 
                  :key="index" 
                  class="chart-bar"
                  :style="{ height: `${(value / Math.max(...chartData)) * 100}%` }"
                >
                  <span class="bar-value">{{ value }}</span>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="(label, index) in chartLabels" :key="index" class="chart-label">
                  {{ label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近活动 -->
    <div class="recent-activities">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
            <el-select v-model="activityFilter" size="small">
              <el-option label="全部" value="all" />
              <el-option label="用户注册" value="user_register" />
              <el-option label="文章发布" value="article_create" />
              <el-option label="帖子发布" value="thread_create" />
              <el-option label="资源上传" value="resource_create" />
              <el-option label="评论" value="comment_create" />
            </el-select>
          </div>
        </template>
        <div class="activity-list">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id" 
            class="activity-item"
          >
            <div class="activity-icon" :class="getActivityIconClass(activity.type)">
              <el-icon>{{ getActivityIcon(activity.type) }}</el-icon>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.description }}</p>
              <p class="activity-time">{{ formatTime(activity.timestamp) }}</p>
            </div>
            <div class="activity-actions">
              <el-button size="small" @click="viewActivity(activity.id)">查看</el-button>
            </div>
          </div>
          
          <div v-if="recentActivities.length === 0" class="no-activities">
            <el-empty description="暂无活动" :image-size="100" />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 系统状态 -->
    <div class="system-status">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>系统状态</span>
          </div>
        </template>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">服务器状态</span>
            <el-tag type="success">正常</el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">数据库状态</span>
            <el-tag type="success">正常</el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">API响应时间</span>
            <el-tag type="info">{{ systemStatus.apiResponseTime }}ms</el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">系统负载</span>
            <el-tag :type="getLoadType(systemStatus.systemLoad)">{{ systemStatus.systemLoad }}%</el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">存储空间</span>
            <el-tag :type="getStorageType(systemStatus.storageUsage)">
              {{ systemStatus.storageUsage }}% 已使用
            </el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">系统版本</span>
            <el-tag type="info">{{ systemStatus.version }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Document, ChatLineSquare, DataAnalysis, Loading, ArrowUp, ArrowDown, Plus, Message, Upload, DataLine } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const stats = ref({
  users: 1234,
  articles: 567,
  threads: 890,
  resources: 234,
  userGrowth: 12.5,
  articleGrowth: 8.2,
  threadGrowth: 15.3,
  resourceGrowth: 5.7
})

const chartType = ref('users')
const activityFilter = ref('all')

// 模拟图表数据
const chartData = ref([12, 19, 15, 17, 22, 28, 24, 30, 26, 32, 28, 35, 32, 38, 34, 40, 36, 42, 38, 45, 42, 48, 44, 50, 46, 52, 48, 55, 52, 58])

const chartLabels = ref(['1', '5', '10', '15', '20', '25', '30'])

// 系统状态
const systemStatus = ref({
  apiResponseTime: 120,
  systemLoad: 45,
  storageUsage: 68,
  version: 'v1.0.0'
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'user_register',
    description: '用户 admin 注册了新账户',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'article_create',
    description: '用户 user1 发布了新文章：Vue 3 进阶技巧',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    type: 'thread_create',
    description: '用户 user2 发布了新帖子：关于 XSS 防护的讨论',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 4,
    type: 'resource_create',
    description: '用户 user3 上传了新资源：Web 安全测试工具集',
    timestamp: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 5,
    type: 'comment_create',
    description: '用户 user4 评论了文章：React vs Vue 对比',
    timestamp: new Date(Date.now() - 14400000).toISOString()
  }
])

// 生命周期
onMounted(() => {
  fetchStats()
})

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    // 这里应该从API获取真实数据，暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟数据已在上面定义
  } catch (error) {
    ElMessage.error('加载统计数据失败')
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshStats = () => {
  fetchStats()
  ElMessage.success('数据已刷新')
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleString('zh-CN')
  }
}

// 获取活动图标
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_register':
      return User
    case 'article_create':
      return Document
    case 'thread_create':
      return ChatLineSquare
    case 'resource_create':
      return Upload
    case 'comment_create':
      return Message
    default:
      return Plus
  }
}

// 获取活动图标类名
const getActivityIconClass = (type: string) => {
  switch (type) {
    case 'user_register':
      return 'user-activity'
    case 'article_create':
      return 'article-activity'
    case 'thread_create':
      return 'thread-activity'
    case 'resource_create':
      return 'resource-activity'
    case 'comment_create':
      return 'comment-activity'
    default:
      return 'default-activity'
  }
}

// 查看活动详情
const viewActivity = (id: number) => {
  ElMessage.info(`查看活动 ID: ${id}`)
}

// 获取负载类型
const getLoadType = (load: number) => {
  if (load < 50) return 'success'
  if (load < 80) return 'warning'
  return 'danger'
}

// 获取存储类型
const getStorageType = (usage: number) => {
  if (usage < 70) return 'success'
  if (usage < 90) return 'warning'
  return 'danger'
}
</script>

<style scoped lang="scss">
.admin-dashboard {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .stat-info {
    flex: 1;
    
    h3 {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin: 0 0 8px 0;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }
    
    .stat-change {
      font-size: 12px;
      
      &.positive {
        color: #67c23a;
      }
      
      &.negative {
        color: #f56c6c;
      }
    }
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    
    &.user-icon {
      background-color: #ecf5ff;
      color: #409eff;
    }
    
    &.article-icon {
      background-color: #f0f9eb;
      color: #67c23a;
    }
    
    &.thread-icon {
      background-color: #fef0e6;
      color: #e6a23c;
    }
    
    &.resource-icon {
      background-color: #f5f0ff;
      color: #909399;
    }
  }
}

.activity-charts,
.recent-activities,
.system-status {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .chart-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .loading-icon {
      font-size: 32px;
      color: #409eff;
    }
  }
}

.mock-chart {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex: 1;
  padding: 20px 0;
}

.chart-bar {
  flex: 1;
  background-color: #409eff;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #66b1ff;
  }
  
  .bar-value {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #666;
  }
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
}

.chart-label {
  font-size: 12px;
  color: #999;
  flex: 1;
  text-align: center;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  
  &.user-activity {
    background-color: #ecf5ff;
    color: #409eff;
  }
  
  &.article-activity {
    background-color: #f0f9eb;
    color: #67c23a;
  }
  
  &.thread-activity {
    background-color: #fef0e6;
    color: #e6a23c;
  }
  
  &.resource-activity {
    background-color: #f5f0ff;
    color: #909399;
  }
  
  &.comment-activity {
    background-color: #f0f0f0;
    color: #606266;
  }
}

.activity-content {
  flex: 1;
  
  .activity-text {
    font-size: 14px;
    color: #333;
    margin: 0 0 4px 0;
  }
  
  .activity-time {
    font-size: 12px;
    color: #999;
    margin: 0;
  }
}

.activity-actions {
  flex-shrink: 0;
}

.no-activities {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-label {
  font-size: 14px;
  color: #666;
}

// 响应式设计
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 12px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
