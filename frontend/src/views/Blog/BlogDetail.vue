<template>
  <div class="blog-detail">
    <div v-if="article" class="blog-content">
      <div class="blog-header">
        <h1>{{ article.title }}</h1>
        <div class="blog-meta">
          <span class="blog-category">{{ article.category.name }}</span>
          <span class="blog-date">{{ formatDate(article.created_at) }}</span>
          <span class="blog-author">作者：{{ article.author.username }}</span>
        </div>
        <div class="blog-tags">
          <span v-for="tag in article.tags" :key="tag" class="blog-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="blog-body">
        <div v-html="article.content"></div>
      </div>
      <div class="blog-footer">
        <div class="blog-stats">
          {{ article.view_count }} 浏览 · {{ article.like_count }} 点赞
        </div>
        <div class="blog-actions">
          <button class="blog-like">点赞</button>
          <button class="blog-share">分享</button>
          <router-link v-if="isAuthenticated" :to="`/blog/edit/${article.id}`" class="blog-edit">编辑</router-link>
        </div>
      </div>
      <div class="blog-comments">
        <h3>评论</h3>
        <div class="comment-form">
          <textarea placeholder="写下你的评论..." v-model="commentContent"></textarea>
          <button @click="submitComment">提交评论</button>
        </div>
        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-author">{{ comment.author.username }}</div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-date">{{ formatDate(comment.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const article = ref<any>(null)
const comments = ref<any[]>([])
const commentContent = ref('')

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'))

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载文章详情
const loadArticle = async () => {
  try {
    const slug = route.params.slug as string
    const data = await blogStore.fetchArticleDetail(slug)
    article.value = data
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return
  
  try {
    // 这里需要调用评论 API
    console.log('提交评论:', commentContent.value)
    commentContent.value = ''
  } catch (error) {
    console.error('提交评论失败:', error)
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped lang="scss">
.blog-detail {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.blog-header {
  margin-bottom: 2rem;
}

.blog-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
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

.blog-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.blog-tag {
  background: #e7f3ff;
  color: #0066cc;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.blog-body {
  margin-bottom: 2rem;
  line-height: 1.8;
  
  h2 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 8px;
  }
}

.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.blog-stats {
  color: #666;
}

.blog-actions {
  display: flex;
  gap: 1rem;
}

.blog-like,
.blog-share {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #e0e0e0;
  }
}

.blog-edit {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.blog-comments {
  margin-top: 3rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
}

.comment-form button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.comment-author {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.comment-content {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.comment-date {
  font-size: 0.875rem;
  color: #666;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.25rem;
  color: #666;
}
</style>
