<template>
  <div class="home-page">
    <!-- 英雄区 -->
    <section class="hero">
      <div class="hero-content">
        <h1>CodeSecHub</h1>
        <p>专注于编程与网络安全的技术社区</p>
        <div class="hero-buttons">
          <router-link to="/blog" class="btn-primary">浏览博客</router-link>
          <router-link to="/forum" class="btn-secondary">加入论坛</router-link>
        </div>
      </div>
    </section>

    <!-- 特色内容 -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>技术博客</h3>
        <p>分享最新的编程技术和网络安全知识</p>
        <router-link to="/blog">查看更多 →</router-link>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💬</div>
        <h3>安全论坛</h3>
        <p>讨论安全问题，交流技术经验</p>
        <router-link to="/forum">加入讨论 →</router-link>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📚</div>
        <h3>资源分享</h3>
        <p>下载安全工具和学习资料</p>
        <router-link to="/resources">浏览资源 →</router-link>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="latest-articles">
      <h2>最新文章</h2>
      <div class="articles-grid" v-if="articles.length > 0">
        <div v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-meta">
            <span class="article-category">{{ article.category.name }}</span>
            <span class="article-date">{{ formatDate(article.created_at) }}</span>
          </div>
          <h3>{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-footer">
            <span class="article-author">作者：{{ article.author.username }}</span>
            <router-link :to="`/blog/${article.slug}`" class="article-read-more">阅读更多</router-link>
          </div>
        </div>
      </div>
      <div v-else class="no-content">
        <p>暂无文章</p>
      </div>
    </section>

    <!-- 热门帖子 -->
    <section class="hot-posts">
      <h2>热门帖子</h2>
      <div class="posts-list" v-if="posts.length > 0">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <h3>{{ post.title }}</h3>
          <p class="post-excerpt">{{ truncateText(post.content, 100) }}</p>
          <div class="post-meta">
            <span class="post-author">{{ post.author.username }}</span>
            <span class="post-replies">{{ post.reply_count }} 回复</span>
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
          </div>
          <router-link :to="`/forum/thread/${post.id}`" class="post-link">查看详情</router-link>
        </div>
      </div>
      <div v-else class="no-content">
        <p>暂无帖子</p>
      </div>
    </section>

    <!-- 推荐资源 -->
    <section class="recommended-resources">
      <h2>推荐资源</h2>
      <div class="resources-grid" v-if="resources.length > 0">
        <div v-for="resource in resources" :key="resource.id" class="resource-card">
          <div class="resource-type">{{ resource.type }}</div>
          <h3>{{ resource.title }}</h3>
          <p class="resource-description">{{ resource.description }}</p>
          <div class="resource-meta">
            <span class="resource-submitter">提交者：{{ resource.submitter.username }}</span>
            <span class="resource-downloads">{{ resource.download_count }} 下载</span>
          </div>
          <router-link :to="`/resources/${resource.id}`" class="resource-link">查看详情</router-link>
        </div>
      </div>
      <div v-else class="no-content">
        <p>暂无资源</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore, useForumStore } from '@/stores'
import { getResourcesApi } from '@/api/resources'

const blogStore = useBlogStore()
const forumStore = useForumStore()

const articles = ref<any[]>([])
const posts = ref<any[]>([])
const resources = ref<any[]>([])

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 加载数据
const loadData = async () => {
  try {
    // 加载文章
    const articlesData = await blogStore.fetchArticles({ page_size: 3 })
    articles.value = articlesData.results

    // 加载帖子
    const postsData = await forumStore.fetchPosts({ page_size: 3 })
    posts.value = postsData.results

    // 加载资源
    const resourcesData = await getResourcesApi({ page_size: 3 })
    resources.value = resourcesData.results
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0;
  text-align: center;
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    p {
      font-size: 20px;
      margin-bottom: 40px;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
      }
      
      .btn-primary {
        background-color: white;
        color: #667eea;
        padding: 12px 30px;
        border-radius: 50px;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      }
      
      .btn-secondary {
        background-color: transparent;
        color: white;
        padding: 12px 30px;
        border: 2px solid white;
        border-radius: 50px;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: white;
          color: #667eea;
        }
      }
    }
  }
}

.features {
  padding: 100px 0;
  background-color: #f8f9fa;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  
  .feature-card {
    background-color: white;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #333;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    a {
      color: #667eea;
      font-weight: 600;
      transition: color 0.3s ease;
      
      &:hover {
        color: #764ba2;
      }
    }
  }
}

.latest-articles,
.hot-posts,
.recommended-resources {
  padding: 100px 0;
  
  h2 {
    font-size: 32px;
    text-align: center;
    margin-bottom: 60px;
    color: #333;
  }
  
  .articles-grid,
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  
  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .article-card,
  .resource-card {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
  }
  
  .article-meta {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #999;
  }
  
  .article-category {
    background-color: #f0f0f0;
    padding: 4px 12px;
    border-radius: 20px;
  }
  
  .article-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .article-summary {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: #999;
  }
  
  .post-item {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #333;
    }
    
    .post-excerpt {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .post-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .resource-type {
    background-color: #e7f3ff;
    color: #0066cc;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    display: inline-block;
    margin-bottom: 15px;
  }
  
  .resource-description {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .resource-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: #999;
  }
  
  .article-read-more,
  .post-link,
  .resource-link {
    color: #667eea;
    font-weight: 600;
    transition: color 0.3s ease;
    
    &:hover {
      color: #764ba2;
    }
  }
  
  .no-content {
    text-align: center;
    padding: 60px 0;
    color: #666;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .hero {
    padding: 80px 0;
    
    .hero-content {
      h1 {
        font-size: 36px;
      }
      
      p {
        font-size: 18px;
      }
    }
  }
  
  .features,
  .latest-articles,
  .hot-posts,
  .recommended-resources {
    padding: 60px 0;
    
    h2 {
      font-size: 24px;
      margin-bottom: 40px;
    }
  }
  
  .article-card,
  .resource-card,
  .post-item {
    padding: 20px;
  }
}
</style>
