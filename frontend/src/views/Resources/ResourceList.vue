<template>
  <div class="resource-list">
    <div class="resource-header">
      <h1>安全资源</h1>
    </div>
    
    <div class="resource-filters">
      <el-select v-model="filter.category" placeholder="按分类筛选" class="category-filter">
        <el-option label="全部" value="" />
        <el-option 
          v-for="category in categories" 
          :key="category.value" 
          :label="category.label" 
          :value="category.value"
        />
      </el-select>
      
      <el-select v-model="filter.type" placeholder="按类型筛选" class="type-filter">
        <el-option label="全部" value="" />
        <el-option 
          v-for="type in resourceTypes" 
          :key="type.value" 
          :label="type.label" 
          :value="type.value"
        />
      </el-select>
      
      <el-input 
        v-model="filter.keyword" 
        placeholder="搜索资源名称或描述"
        class="search-input"
        @keyup.enter="search"
      >
        <template #append>
          <el-button @click="search"><el-icon><Search /></el-icon></el-button>
        </template>
      </el-input>
    </div>
    
    <div class="resource-grid">
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="resources.length === 0" class="empty-state">
        <el-empty description="暂无资源" />
      </div>
      
      <div v-else class="resources">
        <div 
          v-for="resource in resources" 
          :key="resource.id" 
          class="resource-card"
          @click="goToResourceDetail(resource.id)"
        >
          <div class="resource-cover">
            <img :src="resource.coverImage || defaultCover" :alt="resource.title" />
            <div class="resource-badge" :class="resource.type">
              {{ getTypeLabel(resource.type) }}
            </div>
          </div>
          
          <div class="resource-content">
            <h3 class="resource-title">{{ resource.title }}</h3>
            <p class="resource-description">{{ resource.description.substring(0, 100) }}...</p>
            
            <div class="resource-meta">
              <div class="resource-category">
                <el-tag size="small">{{ getCategoryLabel(resource.category) }}</el-tag>
              </div>
              <div class="resource-stats">
                <span class="downloads">
                  <el-icon><Download /></el-icon>
                  {{ resource.downloads || 0 }}
                </span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ resource.views || 0 }}
                </span>
              </div>
            </div>
            
            <div class="resource-author">
              <el-avatar :size="24" :src="resource.author.avatar" />
              <span>{{ resource.author.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination" v-if="!loading && resources.length > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[12, 24, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from '@/stores/resource'
import { Search, Loading, Download, View } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 状态管理
const resourceStore = useResourceStore()

// 响应式数据
const loading = ref(false)
const resources = ref<any[]>([])
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0
})

// 筛选条件
const filter = ref({
  category: '',
  type: '',
  keyword: ''
})

// 分类选项
const categories = [
  { value: 'tools', label: '工具' },
  { value: 'ebooks', label: '电子书' },
  { value: 'courses', label: '课程' },
  { value: 'papers', label: '论文' },
  { value: 'cheatsheets', label: '速查表' },
  { value: 'other', label: '其他' }
]

// 资源类型
const resourceTypes = [
  { value: 'free', label: '免费' },
  { value: 'paid', label: '付费' },
  { value: 'open-source', label: '开源' }
]

// 默认封面图
const defaultCover = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cybersecurity%20resource%20cover%20with%20lock%20icon%20and%20digital%20background&image_size=square'

// 生命周期
onMounted(() => {
  fetchResources()
})

// 获取资源列表
const fetchResources = async () => {
  loading.value = true
  try {
    const response = await resourceStore.getResources({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      category: filter.value.category,
      type: filter.value.type,
      keyword: filter.value.keyword
    })
    resources.value = response.resources
    pagination.value.total = response.total
  } catch (error) {
    console.error('获取资源失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const search = () => {
  pagination.value.page = 1
  fetchResources()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  fetchResources()
}

const handleCurrentChange = (current: number) => {
  pagination.value.page = current
  fetchResources()
}

// 跳转到资源详情
const goToResourceDetail = (resourceId: string) => {
  router.push(`/resources/${resourceId}`)
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '未分类'
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  const typeItem = resourceTypes.find(t => t.value === type)
  return typeItem ? typeItem.label : '未知'
}
</script>

<style scoped lang="scss">
.resource-list {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.resource-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
  
  h1 {
    font-size: 28px;
    color: #333;
    margin: 0;
  }
}

.resource-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  .category-filter,
  .type-filter {
    width: 150px;
  }
  
  .search-input {
    flex: 1;
    max-width: 600px;
  }
}

.resource-grid {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  min-height: 600px;
  
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

.resources {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.resource-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #409eff;
    box-shadow: 0 4px 12px 0 rgba(64, 158, 255, 0.15);
    transform: translateY(-4px);
  }
  
  .resource-cover {
    position: relative;
    height: 180px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
    
    .resource-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: #fff;
      
      &.free {
        background-color: #67c23a;
      }
      
      &.paid {
        background-color: #e6a23c;
      }
      
      &.open-source {
        background-color: #409eff;
      }
    }
  }
  
  .resource-content {
    padding: 16px;
  }
  
  .resource-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }
  
  .resource-description {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin: 0 0 16px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .resource-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .resource-stats {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #999;
    
    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
  
  .resource-author {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #999;
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

// 响应式设计
@media (max-width: 768px) {
  .resource-list {
    padding: 12px;
  }
  
  .resource-filters {
    flex-direction: column;
    
    .category-filter,
    .type-filter {
      width: 100%;
    }
    
    .search-input {
      max-width: none;
    }
  }
  
  .resource-grid {
    padding: 16px;
  }
  
  .resources {
    grid-template-columns: 1fr;
  }
  
  .resource-cover {
    height: 150px !important;
  }
}
</style>
