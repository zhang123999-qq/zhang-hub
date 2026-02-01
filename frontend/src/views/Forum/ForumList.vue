<template>
  <div class="forum-list">
    <div class="forum-header">
      <h1>安全论坛</h1>
      <el-button type="primary" @click="goToCreateThread">发布帖子</el-button>
    </div>
    
    <div class="forum-filters">
      <el-select v-model="filter.category" placeholder="按分类筛选" class="category-filter">
        <el-option label="全部" value="" />
        <el-option 
          v-for="category in categories" 
          :key="category.value" 
          :label="category.label" 
          :value="category.value"
        />
      </el-select>
      
      <el-input 
        v-model="filter.keyword" 
        placeholder="搜索帖子标题或内容"
        class="search-input"
        @keyup.enter="search"
      >
        <template #append>
          <el-button @click="search"><el-icon><Search /></el-icon></el-button>
        </template>
      </el-input>
    </div>
    
    <div class="thread-list">
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="threads.length === 0" class="empty-state">
        <el-empty description="暂无帖子" />
      </div>
      
      <div v-else class="thread-items">
        <div 
          v-for="thread in threads" 
          :key="thread.id" 
          class="thread-item"
          @click="goToThreadDetail(thread.id)"
        >
          <div class="thread-main">
            <h3 class="thread-title">{{ thread.title }}</h3>
            <p class="thread-content">{{ thread.content.substring(0, 100) }}...</p>
            <div class="thread-meta">
              <span class="thread-author">
                <el-avatar :size="24" :src="thread.author.avatar" />
                {{ thread.author.username }}
              </span>
              <span class="thread-time">{{ formatTime(thread.createdAt) }}</span>
              <span class="thread-category">{{ getCategoryLabel(thread.category) }}</span>
            </div>
          </div>
          <div class="thread-stats">
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ thread.repliesCount || 0 }}</span>
            </div>
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ thread.viewsCount || 0 }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ thread.likesCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination" v-if="!loading && threads.length > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '@/stores/forum'
import { Search, Loading, ChatDotRound, View, Star } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 状态管理
const forumStore = useForumStore()

// 响应式数据
const loading = ref(false)
const threads = ref<any[]>([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 筛选条件
const filter = ref({
  category: '',
  keyword: ''
})

// 分类选项
const categories = [
  { value: 'web-security', label: 'Web安全' },
  { value: 'network-security', label: '网络安全' },
  { value: 'cryptography', label: '密码学' },
  { value: 'malware-analysis', label: '恶意软件分析' },
  { value: 'ethical-hacking', label: '道德黑客' },
  { value: 'security-tools', label: '安全工具' },
  { value: 'other', label: '其他' }
]

// 生命周期
onMounted(() => {
  fetchThreads()
})

// 获取帖子列表
const fetchThreads = async () => {
  loading.value = true
  try {
    const response = await forumStore.fetchPosts({
      page: pagination.value.page,
      page_size: pagination.value.pageSize
    })
    threads.value = response.results
    pagination.value.total = response.count
  } catch (error) {
    console.error('获取帖子列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const search = () => {
  pagination.value.page = 1
  fetchThreads()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  fetchThreads()
}

const handleCurrentChange = (current: number) => {
  pagination.value.page = current
  fetchThreads()
}

// 跳转到帖子详情
const goToThreadDetail = (threadId: string) => {
  router.push(`/forum/thread/${threadId}`)
}

// 跳转到创建帖子页面
const goToCreateThread = () => {
  router.push('/forum/create')
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '未分类'
}
</script>

<style scoped lang="scss">
.forum-list {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
  
  h1 {
    font-size: 28px;
    color: #333;
    margin: 0;
  }
}

.forum-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  .category-filter {
    width: 200px;
  }
  
  .search-input {
    flex: 1;
    max-width: 600px;
  }
}

.thread-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 0;
    
    .loading-icon {
      margin-right: 12px;
      font-size: 24px;
      color: #409eff;
    }
  }
  
  .empty-state {
    padding: 48px 0;
  }
}

.thread-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.thread-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  
  .thread-main {
    flex: 1;
    margin-right: 20px;
  }
  
  .thread-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }
  
  .thread-content {
    font-size: 14px;
    color: #666;
    margin: 0 0 16px 0;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .thread-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: #999;
    
    .thread-author {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .thread-category {
      background-color: #ecf5ff;
      color: #409eff;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  .thread-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #666;
      
      el-icon {
        font-size: 16px;
      }
    }
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

// 响应式设计
@media (max-width: 768px) {
  .forum-list {
    padding: 12px;
  }
  
  .forum-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .forum-filters {
    flex-direction: column;
    
    .category-filter {
      width: 100%;
    }
    
    .search-input {
      max-width: none;
    }
  }
  
  .thread-list {
    padding: 16px;
  }
  
  .thread-item {
    flex-direction: column;
    align-items: flex-start;
    
    .thread-main {
      margin-right: 0;
      margin-bottom: 16px;
    }
    
    .thread-stats {
      flex-direction: row;
      align-items: center;
      width: 100%;
      justify-content: space-around;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>
