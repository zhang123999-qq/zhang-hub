<template>
  <div class="tutorial-page">
    <!-- 教程头部 -->
    <section class="tutorial-header">
      <h1>zhang 开发教程</h1>
      <p>学习如何开发和扩展 zhang 平台</p>
    </section>

    <!-- 教程内容 -->
    <section class="tutorial-content">
      <div class="tutorial-nav">
        <ul>
          <li @click="activeSection = 'overview'" :class="{ active: activeSection === 'overview' }">项目概述</li>
          <li @click="activeSection = 'backend'" :class="{ active: activeSection === 'backend' }">后端开发</li>
          <li @click="activeSection = 'frontend'" :class="{ active: activeSection === 'frontend' }">前端开发</li>
          <li @click="activeSection = 'deployment'" :class="{ active: activeSection === 'deployment' }">部署指南</li>
          <li @click="activeSection = 'best-practices'" :class="{ active: activeSection === 'best-practices' }">最佳实践</li>
        </ul>
      </div>

      <div class="tutorial-main">
        <!-- 项目概述 -->
        <div v-if="activeSection === 'overview'" class="section-content">
          <h2>项目概述</h2>
          <p>zhang 是一个专注于编程与网络安全的技术社区，提供博客、论坛、资源分享等功能。</p>

          <h3>技术栈</h3>
          <div class="tech-stack">
            <div class="tech-card">
              <h4>后端技术</h4>
              <ul>
                <li>框架: Django 4.2</li>
                <li>API框架: Django REST Framework 3.14</li>
                <li>数据库: SQLite (开发环境), PostgreSQL (生产环境)</li>
                <li>认证: JWT (JSON Web Token)</li>
                <li>缓存: Redis</li>
                <li>任务队列: Celery</li>
                <li>部署: Docker + Docker Compose</li>
                <li>Web服务器: Nginx</li>
              </ul>
            </div>
            <div class="tech-card">
              <h4>前端技术</h4>
              <ul>
                <li>框架: Vue 3 + TypeScript</li>
                <li>构建工具: Vite</li>
                <li>状态管理: Pinia</li>
                <li>UI组件库: Element Plus</li>
                <li>路由: Vue Router</li>
                <li>HTTP客户端: Axios</li>
                <li>样式: SCSS</li>
                <li>动画: Vue Transition</li>
                <li>进度条: NProgress</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 后端开发 -->
        <div v-if="activeSection === 'backend'" class="section-content">
          <h2>后端开发</h2>
          
          <h3>开发环境搭建</h3>
          <ol>
            <li>
              <strong>安装依赖</strong>
              <pre><code>cd backend
pip install -r requirements.txt</code></pre>
            </li>
            <li>
              <strong>数据库迁移</strong>
              <pre><code>python manage.py makemigrations
python manage.py migrate</code></pre>
            </li>
            <li>
              <strong>创建超级用户</strong>
              <pre><code>python manage.py createsuperuser</code></pre>
            </li>
            <li>
              <strong>启动开发服务器</strong>
              <pre><code>python manage.py runserver</code></pre>
            </li>
          </ol>
        </div>

        <!-- 前端开发 -->
        <div v-if="activeSection === 'frontend'" class="section-content">
          <h2>前端开发</h2>
          
          <h3>开发环境搭建</h3>
          <ol>
            <li>
              <strong>安装依赖</strong>
              <pre><code>cd frontend
npm install</code></pre>
            </li>
            <li>
              <strong>启动开发服务器</strong>
              <pre><code>npm run dev</code></pre>
            </li>
            <li>
              <strong>构建生产版本</strong>
              <pre><code>npm run build</code></pre>
            </li>
          </ol>
        </div>

        <!-- 部署指南 -->
        <div v-if="activeSection === 'deployment'" class="section-content">
          <h2>部署指南</h2>
          
          <h3>Docker部署</h3>
          <ol>
            <li>
              <strong>构建镜像</strong>
              <pre><code># 构建后端镜像
docker build -t zhang-backend ./backend

# 构建前端镜像
docker build -t zhang-frontend ./frontend</code></pre>
            </li>
            <li>
              <strong>启动容器</strong>
              <pre><code>docker-compose up -d</code></pre>
            </li>
          </ol>
        </div>

        <!-- 最佳实践 -->
        <div v-if="activeSection === 'best-practices'" class="section-content">
          <h2>最佳实践</h2>
          
          <h3>代码规范</h3>
          <div class="best-practices-grid">
            <div class="practice-card">
              <h4>后端</h4>
              <ul>
                <li>遵循 PEP 8 代码规范</li>
                <li>使用类型注解</li>
                <li>编写详细的文档字符串</li>
              </ul>
            </div>
            <div class="practice-card">
              <h4>前端</h4>
              <ul>
                <li>遵循 ESLint 代码规范</li>
                <li>使用 TypeScript 类型</li>
                <li>编写详细的注释</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref('overview')
</script>

<style scoped lang="scss">
.tutorial-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.tutorial-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  
  h1 {
    font-size: 42px;
    margin-bottom: 20px;
    font-weight: 700;
  }
  
  p {
    font-size: 18px;
    opacity: 0.9;
  }
}

.tutorial-content {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  gap: 40px;
}

.tutorial-nav {
  width: 250px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: sticky;
  top: 20px;
  height: fit-content;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #f0f0f0;
      }
      
      &.active {
        background-color: #667eea;
        color: white;
      }
    }
  }
}

.tutorial-main {
  flex: 1;
  
  .section-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 32px;
    
    h2 {
      font-size: 28px;
      margin-bottom: 24px;
      color: #333;
    }
    
    h3 {
      font-size: 20px;
      margin: 24px 0 16px;
      color: #555;
    }
    
    p {
      margin-bottom: 16px;
      line-height: 1.6;
      color: #666;
    }
    
    ul,
ol {
      margin-bottom: 20px;
      padding-left: 24px;
      
      li {
        margin-bottom: 8px;
        line-height: 1.5;
      }
    }
    
    pre {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 16px;
      margin: 12px 0 20px;
      overflow-x: auto;
      
      code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        color: #333;
      }
    }
    
    .tech-stack {
      display: flex;
      gap: 24px;
      margin: 24px 0;
      
      .tech-card {
        flex: 1;
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        
        h4 {
          margin-bottom: 16px;
          color: #333;
        }
        
        ul {
          padding-left: 20px;
        }
      }
    }
    
    .best-practices-grid {
      display: flex;
      gap: 24px;
      margin: 24px 0;
      
      .practice-card {
        flex: 1;
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        
        h4 {
          margin-bottom: 16px;
          color: #333;
        }
        
        ul {
          padding-left: 20px;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .tutorial-content {
    flex-direction: column;
  }
  
  .tutorial-nav {
    width: 100%;
    position: relative;
    top: 0;
  }
  
  .tech-stack,
  .best-practices-grid {
    flex-direction: column;
  }
}
</style>