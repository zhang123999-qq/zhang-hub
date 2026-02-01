<template>
  <div class="admin-content">
    <div class="content-header">
      <h1>内容管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshContent">刷新数据</el-button>
      </div>
    </div>
    
    <!-- 内容标签页 -->
    <div class="content-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="文章" name="articles">
          <div class="content-section">
            <div class="section-header">
              <h2>文章管理</h2>
              <el-input 
                v-model="articleSearch" 
                placeholder="搜索文章标题" 
                class="section-search"
                @keyup.enter="searchArticles"
              >
                <template #append>
                  <el-button @click="searchArticles"><el-icon><Search /></el-icon></el-button>
                </template>
              </el-input>
            </div>
            
            <el-table :data="articles" style="width: 100%" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" min-width="200">
                <template #default="scope">
                  <router-link :to="`/blog/${scope.row.slug}`" target="_blank" class="article-link">{{ scope.row.title }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="author.username" label="作者" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="views" label="浏览" width="80" />
              <el-table-column prop="createdAt" label="创建时间" min-width="160">
                <template #default="scope">
                  {{ formatTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <div class="content-actions">
                    <el-button size="small" @click="editArticle(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteArticle(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 文章分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="articlePagination.page"
                v-model:page-size="articlePagination.pageSize"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="articlePagination.total"
                @size-change="handleArticleSizeChange"
                @current-change="handleArticleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="帖子" name="threads">
          <div class="content-section">
            <div class="section-header">
              <h2>帖子管理</h2>
              <el-input 
                v-model="threadSearch" 
                placeholder="搜索帖子标题" 
                class="section-search"
                @keyup.enter="searchThreads"
              >
                <template #append>
                  <el-button @click="searchThreads"><el-icon><Search /></el-icon></el-button>
                </template>
              </el-input>
            </div>
            
            <el-table :data="threads" style="width: 100%" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" min-width="200">
                <template #default="scope">
                  <router-link :to="`/forum/thread/${scope.row.id}`" target="_blank" class="thread-link">{{ scope.row.title }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="author.username" label="作者" width="120" />
              <el-table-column prop="repliesCount" label="回复" width="80" />
              <el-table-column prop="viewsCount" label="浏览" width="80" />
              <el-table-column prop="createdAt" label="创建时间" min-width="160">
                <template #default="scope">
                  {{ formatTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <div class="content-actions">
                    <el-button size="small" @click="editThread(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteThread(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 帖子分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="threadPagination.page"
                v-model:page-size="threadPagination.pageSize"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="threadPagination.total"
                @size-change="handleThreadSizeChange"
                @current-change="handleThreadCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="资源" name="resources">
          <div class="content-section">
            <div class="section-header">
              <h2>资源管理</h2>
              <el-input 
                v-model="resourceSearch" 
                placeholder="搜索资源名称" 
                class="section-search"
                @keyup.enter="searchResources"
              >
                <template #append>
                  <el-button @click="searchResources"><el-icon><Search /></el-icon></el-button>
                </template>
              </el-input>
            </div>
            
            <el-table :data="resources" style="width: 100%" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" min-width="200">
                <template #default="scope">
                  <router-link :to="`/resources/${scope.row.id}`" target="_blank" class="resource-link">{{ scope.row.title }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="author.username" label="上传者" width="120" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="downloads" label="下载" width="80" />
              <el-table-column prop="createdAt" label="上传时间" min-width="160">
                <template #default="scope">
                  {{ formatTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <div class="content-actions">
                    <el-button size="small" @click="editResource(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteResource(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 资源分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="resourcePagination.page"
                v-model:page-size="resourcePagination.pageSize"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resourcePagination.total"
                @size-change="handleResourceSizeChange"
                @current-change="handleResourceCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="评论" name="comments">
          <div class="content-section">
            <div class="section-header">
              <h2>评论管理</h2>
              <el-input 
                v-model="commentSearch" 
                placeholder="搜索评论内容" 
                class="section-search"
                @keyup.enter="searchComments"
              >
                <template #append>
                  <el-button @click="searchComments"><el-icon><Search /></el-icon></el-button>
                </template>
              </el-input>
            </div>
            
            <el-table :data="comments" style="width: 100%" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="content" label="内容" min-width="300">
                <template #default="scope">
                  <p class="comment-content">{{ scope.row.content.substring(0, 100) }}...</p>
                </template>
              </el-table-column>
              <el-table-column prop="author.username" label="评论者" width="120" />
              <el-table-column prop="contentType" label="类型" width="100">
                <template #default="scope">
                  <el-tag type="info">{{ scope.row.contentType === 'article' ? '文章' : '帖子' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="评论时间" min-width="160">
                <template #default="scope">
                  {{ formatTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <div class="content-actions">
                    <el-button size="small" @click="viewComment(scope.row)">查看</el-button>
                    <el-button size="small" type="danger" @click="deleteComment(scope.row)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 评论分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="commentPagination.page"
                v-model:page-size="commentPagination.pageSize"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="commentPagination.total"
                @size-change="handleCommentSizeChange"
                @current-change="handleCommentCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('articles')
const loading = ref(false)

// 搜索关键词
const articleSearch = ref('')
const threadSearch = ref('')
const resourceSearch = ref('')
const commentSearch = ref('')

// 分页数据
const articlePagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const threadPagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const resourcePagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const commentPagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 进阶技巧',
    slug: 'vue-3-advanced-tips',
    author: { username: 'admin' },
    status: 'published',
    views: 1234,
    createdAt: '2026-01-30T10:00:00Z'
  },
  {
    id: 2,
    title: 'React vs Vue 对比',
    slug: 'react-vs-vue',
    author: { username: 'editor' },
    status: 'published',
    views: 890,
    createdAt: '2026-01-29T15:30:00Z'
  },
  {
    id: 3,
    title: 'TypeScript 最佳实践',
    slug: 'typescript-best-practices',
    author: { username: 'user1' },
    status: 'draft',
    views: 0,
    createdAt: '2026-01-28T09:15:00Z'
  }
])

const threads = ref([
  {
    id: 1,
    title: '关于 XSS 防护的讨论',
    author: { username: 'user2' },
    repliesCount: 23,
    viewsCount: 567,
    createdAt: '2026-01-30T12:00:00Z'
  },
  {
    id: 2,
    title: '如何使用 Burp Suite',
    author: { username: 'user3' },
    repliesCount: 15,
    viewsCount: 432,
    createdAt: '2026-01-29T14:20:00Z'
  }
])

const resources = ref([
  {
    id: 1,
    title: 'Web 安全测试工具集',
    author: { username: 'user3' },
    category: 'tools',
    downloads: 123,
    createdAt: '2026-01-30T16:45:00Z'
  },
  {
    id: 2,
    title: '网络安全电子书',
    author: { username: 'admin' },
    category: 'ebooks',
    downloads: 89,
    createdAt: '2026-01-28T11:30:00Z'
  }
])

const comments = ref([
  {
    id: 1,
    content: '这篇文章写得非常好，学到了很多！',
    author: { username: 'user1' },
    contentType: 'article',
    contentId: 1,
    createdAt: '2026-01-30T11:00:00Z'
  },
  {
    id: 2,
    content: '感谢分享，对我很有帮助',
    author: { username: 'user2' },
    contentType: 'thread',
    contentId: 1,
    createdAt: '2026-01-30T12:30:00Z'
  }
])

// 生命周期
onMounted(() => {
  fetchContent()
})

// 获取内容数据
const fetchContent = async () => {
  loading.value = true
  try {
    // 这里应该从API获取真实数据，暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新分页总数
    articlePagination.value.total = articles.value.length
    threadPagination.value.total = threads.value.length
    resourcePagination.value.total = resources.value.length
    commentPagination.value.total = comments.value.length
  } catch (error) {
    ElMessage.error('加载内容失败')
    console.error('加载内容失败:', error)
  } finally {
    loading.value = false
  }
}

// 刷新内容
const refreshContent = () => {
  fetchContent()
  ElMessage.success('数据已刷新')
}

// 处理标签页点击
const handleTabClick = (tab: any) => {
  activeTab.value = tab.paneName
}

// 搜索文章
const searchArticles = () => {
  articlePagination.value.page = 1
  fetchContent()
}

// 搜索帖子
const searchThreads = () => {
  threadPagination.value.page = 1
  fetchContent()
}

// 搜索资源
const searchResources = () => {
  resourcePagination.value.page = 1
  fetchContent()
}

// 搜索评论
const searchComments = () => {
  commentPagination.value.page = 1
  fetchContent()
}

// 分页处理
const handleArticleSizeChange = (size: number) => {
  articlePagination.value.pageSize = size
  articlePagination.value.page = 1
  fetchContent()
}

const handleArticleCurrentChange = (current: number) => {
  articlePagination.value.page = current
  fetchContent()
}

const handleThreadSizeChange = (size: number) => {
  threadPagination.value.pageSize = size
  threadPagination.value.page = 1
  fetchContent()
}

const handleThreadCurrentChange = (current: number) => {
  threadPagination.value.page = current
  fetchContent()
}

const handleResourceSizeChange = (size: number) => {
  resourcePagination.value.pageSize = size
  resourcePagination.value.page = 1
  fetchContent()
}

const handleResourceCurrentChange = (current: number) => {
  resourcePagination.value.page = current
  fetchContent()
}

const handleCommentSizeChange = (size: number) => {
  commentPagination.value.pageSize = size
  commentPagination.value.page = 1
  fetchContent()
}

const handleCommentCurrentChange = (current: number) => {
  commentPagination.value.page = current
  fetchContent()
}

// 编辑文章
const editArticle = (article: any) => {
  ElMessage.info(`编辑文章 ID: ${article.id}`)
}

// 删除文章
const deleteArticle = (article: any) => {
  ElMessageBox.confirm(
    `确定要删除文章 "${article.title}" 吗？此操作不可恢复`,
    '危险',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      articles.value = articles.value.filter(a => a.id !== article.id)
      ElMessage.success('文章删除成功')
      fetchContent()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除文章失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 编辑帖子
const editThread = (thread: any) => {
  ElMessage.info(`编辑帖子 ID: ${thread.id}`)
}

// 删除帖子
const deleteThread = (thread: any) => {
  ElMessageBox.confirm(
    `确定要删除帖子 "${thread.title}" 吗？此操作不可恢复`,
    '危险',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      threads.value = threads.value.filter(t => t.id !== thread.id)
      ElMessage.success('帖子删除成功')
      fetchContent()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除帖子失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 编辑资源
const editResource = (resource: any) => {
  ElMessage.info(`编辑资源 ID: ${resource.id}`)
}

// 删除资源
const deleteResource = (resource: any) => {
  ElMessageBox.confirm(
    `确定要删除资源 "${resource.title}" 吗？此操作不可恢复`,
    '危险',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      resources.value = resources.value.filter(r => r.id !== resource.id)
      ElMessage.success('资源删除成功')
      fetchContent()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除资源失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 查看评论
const viewComment = (comment: any) => {
  ElMessage.info(`查看评论 ID: ${comment.id}`)
}

// 删除评论
const deleteComment = (comment: any) => {
  ElMessageBox.confirm(
    '确定要删除这条评论吗？此操作不可恢复',
    '危险',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    try {
      comments.value = comments.value.filter(c => c.id !== comment.id)
      ElMessage.success('评论删除成功')
      fetchContent()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除评论失败:', error)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'published': return 'success'
    case 'draft': return 'info'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    default: return 'info'
  }
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'published': return '已发布'
    case 'draft': return '草稿'
    case 'pending': return '待审核'
    case 'rejected': return '已拒绝'
    default: return status
  }
}
</script>

<style scoped lang="scss">
.admin-content {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24px;
}

.content-header {
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

.content-tabs {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.content-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .section-search {
    width: 300px;
  }
}

.content-actions {
  display: flex;
  gap: 8px;
}

.article-link,
.thread-link,
.resource-link {
  color: #409eff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.comment-content {
  margin: 0;
  line-height: 1.4;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

// 响应式设计
@media (max-width: 768px) {
  .admin-content {
    padding: 12px;
  }
  
  .content-tabs {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    
    .section-search {
      width: 100%;
    }
  }
  
  .content-actions {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>
