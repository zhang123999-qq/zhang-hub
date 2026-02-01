# CodeSecHub

![CodeSecHub Logo](frontend/src/assets/images/logo.png)

> 代码安全知识共享平台

## 项目简介

CodeSecHub是一个专注于代码安全知识共享的开源平台，旨在为开发者提供一个学习、交流和分享代码安全相关知识的社区。通过整合博客、论坛、资源分享等功能，帮助开发者提升代码安全意识和技能。

## 功能特性

### 🎯 核心功能
- **博客系统**：发布和浏览代码安全相关的技术文章
- **论坛系统**：讨论代码安全问题，分享解决方案
- **资源分享**：上传和下载代码安全相关的工具、文档
- **用户系统**：支持注册、登录、个人资料管理
- **管理后台**：内容管理、用户管理、系统监控

### 🛠️ 技术特性
- **前后端分离**：Vue3 + Python Django 架构
- **响应式设计**：适配PC端和移动端
- **一键部署**：提供Linux自动化部署脚本
- **安全认证**：JWT token认证机制
- **数据库迁移**：自动数据库结构管理

## 技术栈

### 前端技术
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 5.x | 构建工具 |
| Pinia | 2.x | 状态管理 |
| Vue Router | 4.x | 路由管理 |
| Element Plus | 2.x | UI组件库 |
| SCSS | 7.x | CSS预处理器 |
| Axios | 1.x | HTTP客户端 |

### 后端技术
| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.10+ | 后端语言 |
| Django | 4.x | Web框架 |
| Django REST Framework | 3.x | API框架 |
| SQLite | 3.x | 数据库 |
| JWT | - | 认证机制 |

### 部署技术
| 技术 | 版本 | 用途 |
|------|------|------|
| Nginx | 1.18+ | Web服务器 |
| Systemd | - | 服务管理 |
| Bash | - | 部署脚本 |

## 架构设计

### 系统架构
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   前端应用      │────▶│   API接口层     │────▶│   后端服务      │
│  (Vue3 + TS)    │     │  (Django REST)  │     │  (Django Core)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              ▲                       ▲
                              │                       │
                              ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │   认证服务      │     │   数据库        │
                        │  (JWT Token)    │     │  (SQLite)       │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

### 目录结构
```
CodeSecHub/
├── backend/          # 后端Django项目
│   ├── admin_panel/  # 管理后台模块
│   ├── blog/         # 博客模块
│   ├── forum/        # 论坛模块
│   ├── resources/    # 资源分享模块
│   ├── users/        # 用户管理模块
│   ├── backend/      # 项目配置
│   ├── utils/        # 工具函数
│   ├── manage.py     # 管理命令
│   └── requirements.txt # 依赖文件
├── frontend/         # 前端Vue3项目
│   ├── src/          # 源代码
│   │   ├── api/      # API请求
│   │   ├── assets/   # 静态资源
│   │   ├── router/   # 路由配置
│   │   ├── stores/   # 状态管理
│   │   ├── views/    # 页面组件
│   │   └── main.ts   # 入口文件
│   ├── public/       # 公共文件
│   ├── package.json  # 依赖配置
│   └── vite.config.ts # 构建配置
├── setup.sh          # Linux一键部署脚本
├── README.md         # 项目说明
└── GITHUB_PUBLISH_GUIDE.md # GitHub发布指南
```

## 快速开始

### 方法一：Linux一键部署

1. **准备工作**
   - Linux服务器（Ubuntu 20.04+ / CentOS 7+）
   - 网络连接
   - root权限

2. **部署步骤**
   ```bash
   # 1. 上传项目压缩包和部署脚本
   # 2. 解压并执行部署脚本
   chmod +x setup.sh
   sudo ./setup.sh
   ```

3. **访问服务**
   - 前端：`http://服务器IP`
   - 后端API：`http://服务器IP/api/`
   - 管理后台：`http://服务器IP/api/admin/`

4. **默认账号**
   - 用户名：`admin`
   - 密码：`admin123`

### 方法二：本地开发环境

#### 后端开发
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 迁移数据库
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

#### 前端开发
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 核心功能模块

### 1. 博客系统
- **文章发布**：支持富文本编辑，Markdown格式
- **分类标签**：文章分类和标签管理
- **评论系统**：支持文章评论和回复
- **阅读统计**：文章阅读量统计

### 2. 论坛系统
- **主题发布**：发布讨论主题
- **回复功能**：支持主题回复和引用
- **版块管理**：论坛版块分类
- **热度排序**：按热度和时间排序

### 3. 资源分享
- **资源上传**：支持多种文件格式上传
- **资源分类**：按类型和标签分类
- **下载统计**：资源下载量统计
- **评分系统**：资源质量评分

### 4. 用户系统
- **注册登录**：支持邮箱注册和密码登录
- **个人资料**：用户信息管理和修改
- **权限管理**：基于角色的权限控制
- **活动记录**：用户行为和活动记录

### 5. 管理后台
- **内容管理**：审核和管理用户发布的内容
- **用户管理**：管理用户账号和权限
- **系统设置**：配置系统参数和选项
- **数据统计**：系统使用情况统计和分析

## 配置与部署

### 环境配置

#### 前端配置
- **开发环境**：`.env.development`
- **生产环境**：`.env.production`

#### 后端配置
- **主要配置**：`backend/settings.py`
- **数据库配置**：支持SQLite、MySQL、PostgreSQL
- **安全配置**：CORS、CSRF、JWT设置

### 部署选项

1. **Linux服务器部署**
   - 使用提供的`setup.sh`脚本
   - 支持主流Linux发行版

2. **Docker部署**（可选）
   - 可根据项目结构创建Dockerfile
   - 支持Docker Compose编排

3. **云服务部署**
   - 支持AWS、阿里云、腾讯云等云服务
   - 可配合CI/CD工具实现自动化部署

## 开发与贡献

### 开发流程
1. **Fork仓库**：在GitHub上Fork项目仓库
2. **克隆仓库**：`git clone https://github.com/your-username/CodeSecHub.git`
3. **创建分支**：`git checkout -b feature/your-feature`
4. **提交更改**：`git commit -m "Add: your feature"`
5. **推送分支**：`git push origin feature/your-feature`
6. **创建PR**：在GitHub上创建Pull Request

### 代码规范
- **前端**：遵循Vue3和TypeScript最佳实践
- **后端**：遵循PEP 8 Python代码风格指南
- **提交信息**：使用清晰的提交信息格式

### 测试指南
- **单元测试**：`python manage.py test`（后端）
- **构建测试**：`npm run build`（前端）

## 安全特性

### 认证与授权
- JWT token认证
- 密码哈希存储
- 基于角色的权限控制

### 数据安全
- 输入验证和 sanitization
- SQL注入防护
- XSS攻击防护
- CSRF攻击防护

### API安全
- 请求速率限制
- API密钥管理
- HTTPS支持

## 许可证

本项目采用 **MIT License** 开源协议，详见 [LICENSE](LICENSE) 文件。

## 联系方式

### 项目维护
- **GitHub**：[https://github.com/your-username/CodeSecHub](https://github.com/your-username/CodeSecHub)
- **Email**：contact@codesechub.com

### 社区支持
- **Issues**：在GitHub仓库提交问题
- **Discussions**：参与项目讨论
- **Pull Requests**：提交代码贡献

## 鸣谢

感谢以下开源项目和技术的支持：

- [Vue.js](https://vuejs.org/)
- [Django](https://www.djangoproject.com/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

**CodeSecHub** - 让代码安全知识共享更简单

⭐ 如果您觉得这个项目有价值，请给我们一个Star！