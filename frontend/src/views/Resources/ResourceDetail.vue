<template>
  <div class="resource-detail">
    <div class="resource-container">
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="!resource" class="error-state">
        <el-empty description="资源不存在" />
        <el-button @click="goBack">返回资源列表</el-button>
      </div>
      
      <div v-else>
        <!-- 资源头部 -->
        <div class="resource-header">
          <div class="resource-cover">
            <img :src="resource.coverImage || defaultCover" :alt="resource.title" />
            <div class="resource-badge" :class="resource.type">
              {{ getTypeLabel(resource.type) }}
            </div>
          </div>
          
          <div class="resource-info">
            <h1 class="resource-title">{{ resource.title }}</h1>
            <p class="resource-description">{{ resource.description }}</p>
            
            <div class="resource-meta">
              <div class="meta-item">
                <el-tag>{{ getCategoryLabel(resource.category) }}</el-tag>
              </div>
              <div class="meta-item">
                <el-icon><Download /></el-icon>
                <span>{{ resource.downloads || 0 }} 次下载</span>
              </div>
              <div class="meta-item">
                <el-icon><View /></el-icon>
                <span>{{ resource.views || 0 }} 次浏览</span>
              </div>
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ formatTime(resource.createdAt) }}</span>
              </div>
            </div>
            
            <div class="resource-author">
              <el-avatar :size="32" :src="resource.author.avatar" />
              <span>上传者: {{ resource.author.username }}</span>
            </div>
          </div>
        </div>
        
        <!-- 资源详情 -->
        <div class="resource-content">
          <h2>资源详情</h2>
          <div class="content-section">
            <h3>简介</h3>
            <p>{{ resource.content || '暂无详细介绍' }}</p>
          </div>
          
          <div class="content-section" v-if="resource.features && resource.features.length > 0">
            <h3>特点</h3>
            <ul class="feature-list">
              <li v-for="(feature, index) in resource.features" :key="index">
                <el-icon><Check /></el-icon>
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <div class="content-section" v-if="resource.systemRequirements">
            <h3>系统要求</h3>
            <p>{{ resource.systemRequirements }}</p>
          </div>
        </div>
        
        <!-- 下载区域 -->
        <div class="download-section">
          <h2>下载资源</h2>
          
          <div class="download-options">
            <div v-if="resource.downloadLinks && resource.downloadLinks.length > 0">
              <div 
                v-for="(link, index) in resource.downloadLinks" 
                :key="index" 
                class="download-link"
              >
                <el-button 
                  type="primary" 
                  size="large" 
                  class="download-btn"
                  @click="downloadResource(link.url, link.name)"
                >
                  <el-icon><Download /></el-icon>
                  下载 {{ link.name || `链接 ${index + 1}` }}
                </el-button>
                <span class="link-size" v-if="link.size">{{ link.size }}</span>
              </div>
            </div>
            
            <div v-else>
              <el-empty description="暂无下载链接" />
            </div>
          </div>
          
          <div class="download-tips">
            <h3>下载提示</h3>
            <ul>
              <li>请确保您的设备满足系统要求</li>
              <li>下载后请检查文件完整性</li>
              <li>如有任何问题，请联系资源上传者</li>
              <li v-if="resource.type === 'paid'">此资源为付费资源，请确保您已获得授权</li>
            </ul>
          </div>
        </div>
        
        <!-- 相关资源 -->
        <div class="related-resources">
          <h2>相关资源</h2>
          <div class="related-list">
            <div 
              v-for="related in relatedResources" 
              :key="related.id" 
              class="related-item"
              @click="goToResourceDetail(related.id)"
            >
              <img :src="related.coverImage || defaultCover" :alt="related.title" />
              <div class="related-info">
                <h4>{{ related.title }}</h4>
                <span class="related-category">{{ getCategoryLabel(related.category) }}</span>
              </div>
            </div>
            
            <div v-if="relatedResources.length === 0" class="no-related">
              <el-empty description="暂无相关资源" :image-size="100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useResourceStore } from '@/stores/resource'
import { Loading, Download, View, Calendar, Check } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 状态管理
const resourceStore = useResourceStore()

// 响应式数据
const loading = ref(false)
const resource = ref<any>(null)
const relatedResources = ref<any[]>([])

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
  fetchResourceDetail()
})

// 获取资源详情
const fetchResourceDetail = async () => {
  const resourceId = route.params.id as string
  loading.value = true
  try {
    // 获取资源信息
    resource.value = await resourceStore.getResourceById(resourceId)
    
    // 增加浏览量
    await resourceStore.incrementViews(resourceId)
    
    // 获取相关资源
    await fetchRelatedResources()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.error('加载资源失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取相关资源
const fetchRelatedResources = async () => {
  try {
    const response = await resourceStore.getResources({
      page: 1,
      pageSize: 4,
      category: resource.value?.category || '',
      excludeId: resource.value?.id || ''
    })
    relatedResources.value = response.resources
  } catch (error) {
    console.error('获取相关资源失败:', error)
  }
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

// 获取类型标签
const getTypeLabel = (type: string) => {
  const typeItem = resourceTypes.find(t => t.value === type)
  return typeItem ? typeItem.label : '未知'
}

// 下载资源
const downloadResource = (url: string, name: string) => {
  // 这里应该实现下载功能
  ElMessage.info(`开始下载: ${name}`)
  console.log('下载链接:', url)
  
  // 增加下载量
  if (resource.value) {
    resourceStore.incrementDownloads(resource.value.id)
    resource.value.downloads = (resource.value.downloads || 0) + 1
  }
}

// 跳转到资源详情
const goToResourceDetail = (resourceId: string) => {
  router.push(`/resources/${resourceId}`)
}

// 返回资源列表
const goBack = () => {
  router.push('/resources')
}
</script>

<style scoped lang="scss">
.resource-detail {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.resource-container {
  max-width: 1000px;
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

.resource-header {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  gap: 24px;
  
  .resource-cover {
    position: relative;
    width: 300px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
  
  .resource-info {
    flex: 1;
    
    .resource-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }
    
    .resource-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }
    
    .resource-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #666;
      }
    }
    
    .resource-author {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #999;
    }
  }
}

.resource-content,
.download-section,
.related-resources {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }
}

.content-section {
  margin-bottom: 24px;
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
    
    el-icon {
      margin-top: 2px;
      color: #67c23a;
    }
  }
}

.download-options {
  margin-bottom: 24px;
  
  .download-link {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    
    .download-btn {
      flex: 1;
      max-width: 300px;
    }
    
    .link-size {
      font-size: 14px;
      color: #999;
    }
  }
}

.download-tips {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      
      &::before {
        content: "•";
        color: #409eff;
        font-weight: bold;
        margin-top: 4px;
      }
    }
  }
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.related-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
  }
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
  
  .related-info {
    padding: 12px;
    
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .related-category {
      font-size: 12px;
      color: #999;
    }
  }
}

.no-related {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

// 响应式设计
@media (max-width: 768px) {
  .resource-detail {
    padding: 12px;
  }
  
  .resource-header {
    flex-direction: column;
    
    .resource-cover {
      width: 100%;
      height: 200px;
    }
  }
  
  .resource-content,
  .download-section,
  .related-resources {
    padding: 16px;
  }
  
  .resource-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .related-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .related-item img {
    height: 100px;
  }
}
</style>
