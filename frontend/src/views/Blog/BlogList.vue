<template>
  <div class="blog-list">
    <h2>技术博客</h2>
    <div class="blog-grid">
      <div v-for="article in articles" :key="article.id" class="blog-card">
        <div class="blog-meta">
          <span class="blog-category">{{ article.category.name }}</span>
          <span class="blog-date">{{ formatDate(article.created_at) }}</span>
        </div>
        <h3>{{ article.title }}</h3>
        <p class="blog-summary">{{ article.summary }}</p>
        <div class="blog-footer">
          <span class="blog-author">作者：{{ article.author.username }}</span>
          <span class="blog-stats">
            {{ article.view_count }} 浏览 · {{ article.like_count }} 点赞
          </span>
        </div>
        <router-link :to="`/blog/${article.slug}`" class="blog-link">阅读更多</router-link>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

const articles = ref<any[]>([])
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(blogStore.totalCount / blogStore.pageSize))

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 加载文章
const loadArticles = async (page: number = 1) => {
  try {
    await blogStore.fetchArticles({ page })
    articles.value = blogStore.articles
    currentPage.value = page
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    loadArticles(currentPage.value - 1)
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    loadArticles(currentPage.value + 1)
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped lang="scss">
.blog-list {
  padding: 2rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.blog-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.blog-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.blog-category {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.blog-summary {
  margin: 1rem 0;
  color: #666;
  line-height: 1.6;
}

.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.blog-link {
  display: inline-block;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
}
</style>
