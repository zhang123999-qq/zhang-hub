# zhang API 文档

## 项目简介
zhang 是一个编程与网络安全博客论坛系统，提供完整的 RESTful API 接口，支持用户认证、博客文章、论坛讨论和资源分享等功能。

## 基础信息

### API 基础路径
所有 API 端点都以 `/api/` 为前缀。

### 认证方式
- **JWT 令牌认证**：使用 Bearer 令牌
- **认证头部**：`Authorization: Bearer <token>`

### 响应格式
所有 API 响应均为 JSON 格式，包含以下结构：

```json
{
  "status": "success",
  "data": {...},  // 响应数据
  "message": "操作成功"  // 可选的消息
}
```

### 错误响应
```json
{
  "status": "error",
  "code": 400,  // 错误代码
  "message": "错误信息"  // 错误描述
}
```

## API 端点详细文档

### 1. 用户认证 API

#### 1.1 用户注册
- **URL**: `/api/users/register/`
- **方法**: `POST`
- **认证**: 不需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `email` | string | 是 | 邮箱地址 |
| `password` | string | 是 | 密码 |
| `password2` | string | 是 | 确认密码 |
| `role` | string | 否 | 用户角色 (默认: user) |

- **示例请求**:
```json
{
  "username": "newuser",
  "email": "new@example.com",
  "password": "StrongPass123!",
  "password2": "StrongPass123!",
  "role": "user"
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "newuser",
      "email": "new@example.com",
      "role": "user",
      "bio": "",
      "github_url": "",
      "skills": [],
      "reputation": 0,
      "is_active": true
    },
    "message": "用户注册成功"
  }
}
```

#### 1.2 用户登录
- **URL**: `/api/users/login/`
- **方法**: `POST`
- **认证**: 不需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

- **示例请求**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "reputation": 100
    }
  }
}
```

#### 1.3 刷新令牌
- **URL**: `/api/users/refresh/`
- **方法**: `POST`
- **认证**: 不需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `refresh` | string | 是 | 刷新令牌 |

- **示例请求**:
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.4 个人资料
- **URL**: `/api/users/profile/`
- **方法**: `GET`, `PUT`
- **认证**: 需要

##### GET 请求
- **响应示例**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "bio": "系统管理员",
    "github_url": "https://github.com/admin",
    "skills": ["Python", "Django"],
    "reputation": 100,
    "is_active": true
  }
}
```

##### PUT 请求
- **请求参数** (部分更新):

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `bio` | string | 否 | 个人简介 |
| `github_url` | string | 否 | GitHub 地址 |
| `skills` | array | 否 | 技能标签 |

- **示例请求**:
```json
{
  "bio": "Python 开发者",
  "skills": ["Python", "Django", "REST API"]
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "bio": "Python 开发者",
    "github_url": "https://github.com/admin",
    "skills": ["Python", "Django", "REST API"],
    "reputation": 100,
    "is_active": true
  },
  "message": "个人资料更新成功"
}
```

### 2. 博客 API

#### 2.1 文章列表
- **URL**: `/api/blog/articles/`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `category` | string | 否 | 分类 slug |
| `page` | integer | 否 | 页码 (默认: 1) |
| `page_size` | integer | 否 | 每页数量 (默认: 20) |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "count": 10,
    "next": "/api/blog/articles/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Django REST Framework 入门教程",
        "slug": "django-rest-framework-tutorial",
        "content": "# Django REST Framework 入门教程...",
        "summary": "本文介绍如何使用 DRF 创建 RESTful API...",
        "author": {
          "id": 1,
          "username": "admin"
        },
        "category": {
          "id": 3,
          "name": "编程教程",
          "slug": "tutorial"
        },
        "tags": ["Django", "REST API"],
        "status": "published",
        "view_count": 100,
        "like_count": 10,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### 2.2 文章详情
- **URL**: `/api/blog/articles/<slug>/`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `slug` | string | 是 | 文章 slug |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Django REST Framework 入门教程",
    "slug": "django-rest-framework-tutorial",
    "content": "# Django REST Framework 入门教程...",
    "summary": "本文介绍如何使用 DRF 创建 RESTful API...",
    "author": {
      "id": 1,
      "username": "admin"
    },
    "category": {
      "id": 3,
      "name": "编程教程",
      "slug": "tutorial"
    },
    "tags": ["Django", "REST API"],
    "status": "published",
    "view_count": 100,
    "like_count": 10,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### 2.3 创建文章
- **URL**: `/api/blog/articles/create/`
- **方法**: `POST`
- **认证**: 需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | string | 是 | 文章标题 |
| `content` | string | 是 | 文章内容 (Markdown 格式) |
| `summary` | string | 否 | 文章摘要 |
| `category` | integer | 是 | 分类 ID |
| `tags` | array | 否 | 标签列表 |
| `status` | string | 否 | 状态 (draft/published, 默认: draft) |

- **示例请求**:
```json
{
  "title": "Python 安全编程最佳实践",
  "content": "# Python 安全编程最佳实践\n\n本文介绍 Python 编程中的安全最佳实践...",
  "summary": "Python 安全编程的核心原则和实践方法",
  "category": 2,
  "tags": ["Python", "安全编程"],
  "status": "published"
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "title": "Python 安全编程最佳实践",
    "slug": "python-security-best-practices",
    "content": "# Python 安全编程最佳实践...",
    "summary": "Python 安全编程的核心原则和实践方法",
    "author": {
      "id": 1,
      "username": "admin"
    },
    "category": {
      "id": 2,
      "name": "安全工具",
      "slug": "tools"
    },
    "tags": ["Python", "安全编程"],
    "status": "published",
    "view_count": 0,
    "like_count": 0,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "文章创建成功"
}
```

#### 2.4 分类列表
- **URL**: `/api/blog/categories/`
- **方法**: `GET`
- **认证**: 不需要

- **示例响应**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "漏洞分析",
      "slug": "vulnerability"
    },
    {
      "id": 2,
      "name": "安全工具",
      "slug": "tools"
    },
    {
      "id": 3,
      "name": "编程教程",
      "slug": "tutorial"
    },
    {
      "id": 4,
      "name": "CTF Writeup",
      "slug": "ctf"
    }
  ]
}
```

### 3. 论坛 API

#### 3.1 帖子列表
- **URL**: `/api/forum/posts/`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `page` | integer | 否 | 页码 (默认: 1) |
| `page_size` | integer | 否 | 每页数量 (默认: 20) |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "如何提高代码安全性？",
        "content": "大家好，我想了解如何在日常开发中提高代码的安全性...",
        "author": {
          "id": 3,
          "username": "user1"
        },
        "tags": ["安全编程", "最佳实践"],
        "view_count": 50,
        "reply_count": 5,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### 3.2 帖子详情
- **URL**: `/api/forum/posts/<id>/`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | integer | 是 | 帖子 ID |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "如何提高代码安全性？",
    "content": "大家好，我想了解如何在日常开发中提高代码的安全性...",
    "author": {
      "id": 3,
      "username": "user1"
    },
    "tags": ["安全编程", "最佳实践"],
    "view_count": 50,
    "reply_count": 5,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "comments": [
      {
        "id": 1,
        "content": "这是一个很好的问题！",
        "author": {
          "id": 1,
          "username": "admin"
        },
        "created_at": "2024-01-01T12:30:00Z"
      }
    ]
  }
}
```

#### 3.3 创建帖子
- **URL**: `/api/forum/posts/create/`
- **方法**: `POST`
- **认证**: 需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | string | 是 | 帖子标题 |
| `content` | string | 是 | 帖子内容 |
| `tags` | array | 否 | 标签列表 |

- **示例请求**:
```json
{
  "title": "推荐一些安全测试工具",
  "content": "请大家推荐一些常用的安全测试工具，特别是 Web 应用安全测试工具...",
  "tags": ["安全工具", "测试"]
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "title": "推荐一些安全测试工具",
    "content": "请大家推荐一些常用的安全测试工具...",
    "author": {
      "id": 1,
      "username": "admin"
    },
    "tags": ["安全工具", "测试"],
    "view_count": 0,
    "reply_count": 0,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "帖子创建成功"
}
```

#### 3.4 创建评论
- **URL**: `/api/forum/comments/create/`
- **方法**: `POST`
- **认证**: 需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `content` | string | 是 | 评论内容 |
| `post` | integer | 二选一 | 帖子 ID (评论帖子时填写) |
| `article` | integer | 二选一 | 文章 ID (评论文章时填写) |
| `parent` | integer | 否 | 父评论 ID (回复评论时填写) |

- **示例请求** (评论帖子):
```json
{
  "content": "我推荐使用 Burp Suite 进行 Web 应用安全测试",
  "post": 2
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "content": "我推荐使用 Burp Suite 进行 Web 应用安全测试",
    "author": {
      "id": 1,
      "username": "admin"
    },
    "post": 2,
    "article": null,
    "parent": null,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "评论创建成功"
}
```

### 4. 资源 API

#### 4.1 资源列表
- **URL**: `/api/resources/resources/`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `type` | string | 否 | 资源类型 (tool/document/course/other) |
| `page` | integer | 否 | 页码 (默认: 1) |
| `page_size` | integer | 否 | 每页数量 (默认: 20) |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "OWASP Top 10",
        "description": "OWASP 十大 Web 应用安全风险",
        "url": "https://owasp.org/www-project-top-ten/",
        "type": "document",
        "submitter": {
          "id": 2,
          "username": "researcher"
        },
        "tags": ["安全", "OWASP"],
        "download_count": 100,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### 4.2 资源详情
- **URL**: `/api/resources/resources/<id>/`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | integer | 是 | 资源 ID |

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "OWASP Top 10",
    "description": "OWASP 十大 Web 应用安全风险",
    "url": "https://owasp.org/www-project-top-ten/",
    "type": "document",
    "submitter": {
      "id": 2,
      "username": "researcher"
    },
    "tags": ["安全", "OWASP"],
    "download_count": 100,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### 4.3 创建资源
- **URL**: `/api/resources/resources/create/`
- **方法**: `POST`
- **认证**: 需要
- **请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | string | 是 | 资源标题 |
| `description` | string | 是 | 资源描述 |
| `url` | string | 是 | 资源链接 |
| `type` | string | 是 | 资源类型 (tool/document/course/other) |
| `tags` | array | 否 | 标签列表 |

- **示例请求**:
```json
{
  "title": "Burp Suite",
  "description": "Web安全测试工具",
  "url": "https://portswigger.net/burp",
  "type": "tool",
  "tags": ["安全工具", "Web安全"]
}
```

- **示例响应**:
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "title": "Burp Suite",
    "description": "Web安全测试工具",
    "url": "https://portswigger.net/burp",
    "type": "tool",
    "submitter": {
      "id": 1,
      "username": "admin"
    },
    "tags": ["安全工具", "Web安全"],
    "download_count": 0,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "资源创建成功"
}
```

## 错误代码与处理

| 错误代码 | 描述 | 处理方法 |
|---------|------|---------|
| 400 | 请求参数错误 | 检查请求参数格式和内容 |
| 401 | 未认证 | 提供有效的 JWT 令牌 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源 ID 或路径是否正确 |
| 500 | 服务器内部错误 | 联系系统管理员 |

## 认证流程示例

### 1. 用户登录获取令牌
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. 使用令牌访问受保护资源
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer <token>"
```

### 3. 刷新令牌
```bash
curl -X POST http://localhost:8000/api/users/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

## 开发说明

### 本地开发环境
- **API 基础 URL**: `http://localhost:8000/api/`
- **调试模式**: 启用 (DEBUG=True)

### 生产环境
- **API 基础 URL**: `https://yourdomain.com/api/`
- **调试模式**: 禁用 (DEBUG=False)
- **SSL**: 启用

## 版本信息

- **API 版本**: v1
- **Django**: 4.2
- **Django REST Framework**: 3.14
- **JWT 库**: djangorestframework-simplejwt 5.2.2

## 联系信息

- **项目地址**: zhang
- **文档版本**: 1.0.0
- **最后更新**: 2026-02-01

## 六、PyCharm 测试和运行

### 1. PyCharm 项目设置
1. **打开项目**：在 PyCharm 中打开 `zhang` 目录
2. **配置虚拟环境**：File → Settings → Project → Python Interpreter，选择 `backend/venv/Scripts/python.exe`
3. **配置运行/调试配置**：添加 Django Server 配置，设置 Host 为 127.0.0.1，Port 为 8000

### 2. 运行 API 测试
1. **使用 PyCharm 测试运行器**：
   - 找到测试文件：`backend/tests/test_api.py`
   - 右键点击文件，选择 "Run 'pytest in test_api.py'"
   - 查看测试结果和覆盖率

2. **使用 HTTP Client 测试 API**：
   - 打开 Tools → HTTP Client → Create Request
   - 编写测试请求，例如：
     ```
     POST http://localhost:8000/api/users/login/
     Content-Type: application/json

     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - 发送请求并查看响应

### 3. 调试 API
1. **设置断点**：在 API 视图函数中设置断点
2. **启动调试**：选择 Django Server 配置，点击调试按钮
3. **发送请求**：使用 HTTP Client 或浏览器发送 API 请求
4. **查看变量**：在 Debug 窗口中查看请求参数、响应数据等

### 4. 性能分析
1. **使用 PyCharm 性能分析器**：
   - 选择 Django Server 配置
   - 点击 "Profile" 按钮
   - 发送 API 请求
   - 查看性能分析结果

2. **分析数据库查询**：
   - 使用 Django Debug Toolbar（如果已安装）
   - 或在代码中添加 `print()` 语句输出查询时间

## 七、Docker 环境中的 API 测试

1. **使用 Docker Compose 启动服务**：
   ```bash
   docker-compose up --build -d
   ```

2. **测试 API 端点**：
   ```bash
   curl -X POST http://localhost:8000/api/users/login/ \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'
   ```

3. **查看 API 日志**：
   ```bash
   docker-compose logs backend
   ```
