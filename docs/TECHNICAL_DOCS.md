# zhang 技术文档

## 项目概述

zhang 是一个专注于编程与网络安全的技术社区，提供博客、论坛、资源分享等功能。

## 技术栈

### 后端技术
- **框架**: Django 4.2
- **API框架**: Django REST Framework 3.14
- **数据库**: SQLite (开发环境), PostgreSQL (生产环境)
- **认证**: JWT (JSON Web Token)
- **缓存**: Redis
- **任务队列**: Celery
- **部署**: Docker + Docker Compose
- **Web服务器**: Nginx

### 前端技术
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件库**: Element Plus
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **样式**: SCSS
- **动画**: Vue Transition
- **进度条**: NProgress

## 项目架构

### 后端架构

```
backend/
├── admin_panel/          # 管理后台
├── backend/              # 项目配置
├── blog/                 # 博客模块
├── forum/                # 论坛模块
├── resources/            # 资源模块
├── users/                # 用户模块
├── utils/                # 工具函数
├── manage.py             # 管理脚本
└── requirements.txt      # 依赖文件
```

### 前端架构

```
frontend/
├── src/
│   ├── api/              # API请求
│   ├── assets/           # 静态资源
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── index.html            # HTML模板
├── package.json          # 依赖配置
└── vite.config.ts        # Vite配置
```

## 核心功能

### 1. 用户系统
- 注册/登录
- 个人资料管理
- 角色权限控制
- 声誉系统

### 2. 博客系统
- 文章发布/编辑
- 分类标签
- 评论系统
- 阅读统计

### 3. 论坛系统
- 帖子发布/回复
- 板块管理
- 热门帖子
- 通知系统

### 4. 资源系统
- 资源上传/下载
- 资源分类
- 评分系统
- 资源搜索

### 5. 管理后台
- 仪表盘
- 用户管理
- 内容管理
- 系统设置

## 开发环境搭建

### 后端环境

1. **安装依赖**

```bash
cd backend
pip install -r requirements.txt
```

2. **数据库迁移**

```bash
python manage.py makemigrations
python manage.py migrate
```

3. **创建超级用户**

```bash
python manage.py createsuperuser
```

4. **启动开发服务器**

```bash
python manage.py runserver
```

### 前端环境

1. **安装依赖**

```bash
cd frontend
npm install
```

2. **启动开发服务器**

```bash
npm run dev
```

3. **构建生产版本**

```bash
npm run build
```

## API设计

### API根路径
- `http://localhost:8000/api/`

### 主要端点

- **用户**:
  - `GET /api/users/` - 获取用户列表
  - `POST /api/users/` - 创建用户
  - `GET /api/users/{id}/` - 获取用户详情
  - `PUT /api/users/{id}/` - 更新用户
  - `DELETE /api/users/{id}/` - 删除用户

- **博客**:
  - `GET /api/blog/articles/` - 获取文章列表
  - `POST /api/blog/articles/` - 创建文章
  - `GET /api/blog/articles/{id}/` - 获取文章详情
  - `PUT /api/blog/articles/{id}/` - 更新文章
  - `DELETE /api/blog/articles/{id}/` - 删除文章

- **论坛**:
  - `GET /api/forum/posts/` - 获取帖子列表
  - `POST /api/forum/posts/` - 创建帖子
  - `GET /api/forum/posts/{id}/` - 获取帖子详情
  - `PUT /api/forum/posts/{id}/` - 更新帖子
  - `DELETE /api/forum/posts/{id}/` - 删除帖子
  - `GET /api/forum/comments/` - 获取评论列表
  - `POST /api/forum/comments/` - 创建评论

- **资源**:
  - `GET /api/resources/` - 获取资源列表
  - `POST /api/resources/` - 创建资源
  - `GET /api/resources/{id}/` - 获取资源详情
  - `PUT /api/resources/{id}/` - 更新资源
  - `DELETE /api/resources/{id}/` - 删除资源

## 部署流程

### Docker部署

1. **构建镜像**

```bash
# 构建后端镜像
docker build -t zhang-backend ./backend

# 构建前端镜像
docker build -t zhang-frontend ./frontend
```

2. **启动容器**

```bash
docker-compose up -d
```

3. **访问应用**

- 前端: `http://localhost:8080`
- 后端API: `http://localhost:8000/api/`
- 管理后台: `http://localhost:8000/admin/`

### Nginx配置

Nginx 作为反向代理，将请求转发到后端和前端服务。

## 开发教程

### 1. 如何添加新功能

#### 后端

1. **创建新的应用**

```bash
python manage.py startapp newapp
```

2. **配置路由**

在 `newapp/api/urls.py` 中添加路由：

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.NewAppList.as_view(), name='newapp-list'),
    path('<int:pk>/', views.NewAppDetail.as_view(), name='newapp-detail'),
]
```

3. **配置视图**

在 `newapp/views.py` 中添加视图：

```python
from rest_framework import viewsets
from .models import NewApp
from .serializers import NewAppSerializer

class NewAppViewSet(viewsets.ModelViewSet):
    queryset = NewApp.objects.all()
    serializer_class = NewAppSerializer
```

4. **配置序列化器**

在 `newapp/serializers.py` 中添加序列化器：

```python
from rest_framework import serializers
from .models import NewApp

class NewAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewApp
        fields = '__all__'
```

5. **配置模型**

在 `newapp/models.py` 中添加模型：

```python
from django.db import models

class NewApp(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
```

6. **注册应用**

在 `backend/settings.py` 中注册应用：

```python
INSTALLED_APPS = [
    # ...
    'newapp',
]
```

7. **添加到主路由**

在 `backend/urls.py` 中添加路由：

```python
urlpatterns = [
    # ...
    path('api/newapp/', include('newapp.api.urls')),
]
```

#### 前端

1. **创建API服务**

在 `src/api/` 中创建 `newapp.ts`：

```typescript
import { http } from './axios'

export const getNewAppList = () => {
  return http.get('/api/newapp/')
}

export const getNewAppDetail = (id: number) => {
  return http.get(`/api/newapp/${id}/`)
}

export const createNewApp = (data: any) => {
  return http.post('/api/newapp/', data)
}

export const updateNewApp = (id: number, data: any) => {
  return http.put(`/api/newapp/${id}/`, data)
}

export const deleteNewApp = (id: number) => {
  return http.delete(`/api/newapp/${id}/`)
}
```

2. **创建状态管理**

在 `src/stores/` 中创建 `newapp.ts`：

```typescript
import { defineStore } from 'pinia'
import { getNewAppList, getNewAppDetail, createNewApp, updateNewApp, deleteNewApp } from '@/api/newapp'

export const useNewAppStore = defineStore('newapp', {
  state: () => ({
    list: [],
    current: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchNewAppList() {
      this.loading = true
      try {
        const response = await getNewAppList()
        this.list = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    
    async fetchNewAppDetail(id: number) {
      this.loading = true
      try {
        const response = await getNewAppDetail(id)
        this.current = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    
    async createNewApp(data: any) {
      this.loading = true
      try {
        const response = await createNewApp(data)
        this.list.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateNewApp(id: number, data: any) {
      this.loading = true
      try {
        const response = await updateNewApp(id, data)
        const index = this.list.findIndex(item => item.id === id)
        if (index !== -1) {
          this.list[index] = response.data
        }
        if (this.current && this.current.id === id) {
          this.current = response.data
        }
        return response.data
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteNewApp(id: number) {
      this.loading = true
      try {
        await deleteNewApp(id)
        this.list = this.list.filter(item => item.id !== id)
        if (this.current && this.current.id === id) {
          this.current = null
        }
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
```

3. **创建页面组件**

在 `src/views/` 中创建 `NewApp/` 目录，并添加以下文件：

- `NewAppList.vue` - 列表页面
- `NewAppDetail.vue` - 详情页面
- `NewAppCreate.vue` - 创建页面
- `NewAppEdit.vue` - 编辑页面

4. **配置路由**

在 `src/router/index.ts` 中添加路由：

```typescript
const NewAppList = () => import('@/views/NewApp/NewAppList.vue')
const NewAppDetail = () => import('@/views/NewApp/NewAppDetail.vue')
const NewAppCreate = () => import('@/views/NewApp/NewAppCreate.vue')
const NewAppEdit = () => import('@/views/NewApp/NewAppEdit.vue')

// ...

const routes: RouteRecordRaw[] = [
  // ...
  {
    path: '/newapp',
    name: 'NewApp',
    component: NewAppList,
    meta: {
      title: '新应用',
      requiresAuth: false
    }
  },
  {
    path: '/newapp/:id',
    name: 'NewAppDetail',
    component: NewAppDetail,
    props: true,
    meta: {
      title: '新应用详情',
      requiresAuth: false
    }
  },
  {
    path: '/newapp/create',
    name: 'NewAppCreate',
    component: NewAppCreate,
    meta: {
      title: '创建新应用',
      requiresAuth: true
    }
  },
  {
    path: '/newapp/edit/:id',
    name: 'NewAppEdit',
    component: NewAppEdit,
    props: true,
    meta: {
      title: '编辑新应用',
      requiresAuth: true
    }
  }
]
```

### 2. 如何进行测试

#### 后端测试

1. **运行测试**

```bash
python manage.py test
```

2. **编写测试用例**

在 `newapp/tests.py` 中编写测试用例：

```python
from django.test import TestCase
from rest_framework.test import APIClient
from .models import NewApp

class NewAppTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.newapp = NewApp.objects.create(name='Test App', description='Test Description')
    
    def test_get_newapp_list(self):
        response = self.client.get('/api/newapp/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test App', str(response.content))
    
    def test_get_newapp_detail(self):
        response = self.client.get(f'/api/newapp/{self.newapp.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test App', str(response.content))
```

#### 前端测试

1. **运行测试**

```bash
npm run test
```

2. **编写测试用例**

在 `src/views/NewApp/` 中创建 `__tests__` 目录，并添加测试文件：

```typescript
import { mount } from '@vue/test-utils'
import NewAppList from '../NewAppList.vue'

describe('NewAppList', () => {
  it('renders correctly', () => {
    const wrapper = mount(NewAppList)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### 3. 如何部署到生产环境

1. **配置环境变量**

在 `.env.production` 中配置环境变量：

```
VITE_APP_NAME=zhang
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_API_URL=https://api.zhang.com/api
VITE_WS_URL=wss://api.zhang.com/ws
```

2. **构建前端**

```bash
npm run build
```

3. **部署后端**

```bash
# 安装依赖
pip install -r requirements.txt

# 数据库迁移
python manage.py makemigrations
python manage.py migrate

# 收集静态文件
python manage.py collectstatic --noinput

# 启动服务
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

4. **配置Nginx**

```nginx
server {
    listen 80;
    server_name zhang.com;
    
    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

5. **重启服务**

```bash
sudo systemctl restart nginx
sudo systemctl restart gunicorn
```

## 最佳实践

### 代码规范

#### 后端
- 遵循 PEP 8 代码规范
- 使用类型注解
- 编写详细的文档字符串
- 保持函数和方法的单一职责

#### 前端
- 遵循 ESLint 代码规范
- 使用 TypeScript 类型
- 编写详细的注释
- 组件命名使用 PascalCase
- 变量和函数命名使用 camelCase

### 性能优化

#### 后端
- 使用缓存减少数据库查询
- 使用分页减少数据传输
- 使用索引优化数据库查询
- 使用异步任务处理耗时操作

#### 前端
- 使用 Vue 3 的 Composition API
- 使用虚拟列表处理长列表
- 使用懒加载减少初始加载时间
- 使用 CDN 加载第三方库
- 使用 Gzip 压缩静态资源

### 安全最佳实践

#### 后端
- 使用 HTTPS
- 实现 CSRF 保护
- 实现 XSS 保护
- 实现 SQL 注入保护
- 使用密码哈希存储
- 实现请求限流

#### 前端
- 使用 HTTPS
- 实现 CSP (Content Security Policy)
- 避免使用 eval()
- 验证用户输入
- 使用安全的 Cookie 设置

## 常见问题

### 1. 后端 API 访问失败

**可能原因**：
- 后端服务器未启动
- API 路由配置错误
- 权限验证失败
- 数据库连接失败

**解决方案**：
- 检查后端服务器状态
- 检查 API 路由配置
- 检查用户认证信息
- 检查数据库连接

### 2. 前端页面加载失败

**可能原因**：
- 前端服务器未启动
- 路由配置错误
- 资源文件缺失
- API 访问失败

**解决方案**：
- 检查前端服务器状态
- 检查路由配置
- 检查资源文件是否存在
- 检查 API 访问状态

### 3. 部署后无法访问

**可能原因**：
- Nginx 配置错误
- 端口未开放
- 防火墙阻止
- 域名解析错误

**解决方案**：
- 检查 Nginx 配置
- 检查端口开放状态
- 检查防火墙规则
- 检查域名解析

## 总结

zhang 是一个功能完整的技术社区平台，使用现代的前后端技术栈构建。本文档提供了项目的技术架构、开发流程、部署方法等详细信息，希望能帮助开发者快速上手和贡献代码。

---

**项目名称**: zhang
**版本**: 1.0.0
**最后更新**: 2026-02-01
