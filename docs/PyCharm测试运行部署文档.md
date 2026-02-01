# PyCharm 测试运行部署文档

## 一、PyCharm 项目设置

### 1. 项目导入
1. **打开 PyCharm**，选择 "Open" 或 "Import Project"
2. **导航到项目目录**：`d:\迅雷下载\博客个人\lztp_Leftfiles\CodeSecHub`
3. **选择目录**并点击 "OK"
4. **选择打开方式**：选择 "Open as Project"

### 2. 虚拟环境设置
1. **打开设置**：File → Settings → Project → Python Interpreter
2. **添加虚拟环境**：
   - 点击右上角的齿轮图标 → Add
   - 选择 "Existing environment"
   - 导航到 `backend/venv/Scripts/python.exe`
   - 点击 "OK"

### 3. 项目配置
1. **设置项目结构**：File → Settings → Project → Project Structure
   - 确保 `backend` 目录被标记为 Sources Root
   - 确保 `frontend` 目录被正确识别

2. **配置运行/调试配置**：
   - 点击顶部工具栏的 "Add Configuration"
   - 点击 "+" 按钮，选择 "Django Server"
   - **名称**：Django Server
   - **Host**：127.0.0.1
   - **Port**：8000
   - **Environment variables**：点击 "..." 按钮，添加必要的环境变量
   - **Working directory**：`backend` 目录
   - **Python interpreter**：选择之前设置的虚拟环境
   - 点击 "OK"

## 二、运行和测试

### 1. 运行 Django 开发服务器
1. **确保数据库迁移已执行**：
   - 打开 Terminal：View → Tool Windows → Terminal
   - 执行命令：`python manage.py migrate`

2. **创建超级用户**（可选）：
   - 执行命令：`python manage.py createsuperuser`
   - 按照提示输入用户名、邮箱和密码

3. **运行开发服务器**：
   - 选择顶部工具栏的 "Django Server" 配置
   - 点击绿色的运行按钮
   - 服务器将在 `http://127.0.0.1:8000` 启动

### 2. 运行测试
1. **运行所有测试**：
   - 打开 Terminal
   - 执行命令：`python manage.py test`

2. **运行特定应用的测试**：
   - 执行命令：`python manage.py test users`（运行 users 应用的测试）

3. **运行特定测试文件**：
   - 执行命令：`python manage.py test users.tests.test_api`

4. **使用 PyCharm 测试运行器**：
   - 在 Project 视图中，找到测试文件（如 `backend/users/tests/test_api.py`）
   - 右键点击测试文件，选择 "Run 'pytest in test_api.py'"
   - 测试结果将显示在 Run 窗口中

### 3. 代码质量检查
1. **设置 ESLint**（前端）：
   - 打开 Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - 选择 "Automatic ESLint configuration"
   - 点击 "OK"

2. **设置 PEP 8 检查**（后端）：
   - 打开 Settings → Editor → Inspections
   - 展开 "Python" → 确保 "PEP 8 coding style violation" 被勾选
   - 点击 "OK"

## 三、Docker 容器运行

### 1. Docker 配置
1. **确保 Docker Desktop 已安装**并运行
2. **配置 Docker Compose**：
   - 在 Project 视图中，找到 `docker-compose.yml` 文件
   - 右键点击该文件，选择 "Run Docker Compose"

### 2. 运行 Docker 容器
1. **使用 PyCharm 的 Docker 工具**：
   - 打开 Docker 工具窗口：View → Tool Windows → Docker
   - 可以看到正在运行的容器和镜像

2. **查看容器日志**：
   - 在 Docker 工具窗口中，右键点击容器，选择 "Show Log"

3. **进入容器终端**：
   - 在 Docker 工具窗口中，右键点击容器，选择 "Exec Console"

### 3. 环境变量配置
1. **创建 .env 文件**：
   - 在项目根目录创建 `.env` 文件
   - 基于 `.env.example` 文件，填写必要的环境变量

   ```
   # 数据库配置
   DB_PASSWORD=your_database_password
   DB_ROOT_PASSWORD=your_root_password

   # Django 配置
   SECRET_KEY=your_secret_key
   DEBUG=True

   # Redis 配置
   REDIS_URL=redis://redis:6379/0
   ```

## 四、部署配置

### 1. Nginx 配置
1. **配置 Nginx**：
   - 确保 `nginx` 目录存在：`zhang/nginx`
   - 在该目录中创建 `nginx.conf` 文件

2. **Nginx 配置示例**：
   ```nginx
   events {
       worker_connections 1024;
   }

   http {
       include /etc/nginx/mime.types;
       default_type application/octet-stream;

       server {
           listen 80;
           server_name localhost;

           location / {
               proxy_pass http://frontend:3000;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }

           location /api/ {
               proxy_pass http://backend:8000/api/;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }

           location /admin/ {
               proxy_pass http://backend:8000/admin/;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }

           location /static/ {
               alias /app/static/;
           }

           location /media/ {
               alias /app/media/;
           }
       }
   }
   ```

### 2. Docker Compose 部署
1. **使用 Docker Compose 启动所有服务**：
   - 打开 Terminal
   - 执行命令：`docker-compose up --build -d`

2. **查看服务状态**：
   - 执行命令：`docker-compose ps`

3. **停止服务**：
   - 执行命令：`docker-compose down`

### 3. 生产环境部署
1. **准备生产环境配置**：
   - 创建 `docker-compose.prod.yml` 文件
   - 配置生产环境的环境变量

2. **部署到生产环境**：
   - 执行命令：`docker-compose -f docker-compose.prod.yml up --build -d`

## 五、常见问题与解决方案

### 1. 数据库连接问题
- **问题**：无法连接到数据库
- **解决方案**：
  - 确保 MySQL 容器正在运行
  - 检查环境变量配置是否正确
  - 检查 `docker-compose.yml` 中的数据库配置

### 2. 虚拟环境问题
- **问题**：无法找到虚拟环境
- **解决方案**：
  - 重新创建虚拟环境：`python -m venv venv`
  - 重新安装依赖：`pip install -r requirements.txt`

### 3. 端口冲突
- **问题**：端口 8000 或 3000 已被占用
- **解决方案**：
  - 修改 `docker-compose.yml` 中的端口映射
  - 或者停止占用端口的其他服务

### 4. 静态文件问题
- **问题**：静态文件无法加载
- **解决方案**：
  - 执行 `python manage.py collectstatic`
  - 检查 Nginx 配置中的静态文件路径

## 六、调试技巧

### 1. PyCharm 调试器
1. **设置断点**：在代码行号旁边点击，添加断点
2. **启动调试**：点击绿色的虫子图标，启动调试模式
3. **查看变量**：在 Debug 工具窗口中，可以查看变量的值
4. **单步执行**：使用 F8（单步跳过）、F7（单步进）、Shift+F8（单步退出）

### 2. 日志查看
1. **Django 日志**：
   - 运行服务器时，日志会显示在 Run 窗口中
   - 也可以在 `backend` 目录中查看日志文件

2. **Docker 容器日志**：
   - 使用 `docker logs <container_id>` 命令
   - 或在 PyCharm 的 Docker 工具窗口中查看

### 3. API 测试
1. **使用 PyCharm 的 HTTP Client**：
   - 打开 Tools → HTTP Client → Create Request
   - 编写 HTTP 请求并发送

2. **使用 curl 命令**：
   - 在 Terminal 中执行 curl 命令测试 API

## 七、性能优化

### 1. PyCharm 性能优化
1. **调整内存设置**：
   - Help → Edit Custom VM Options
   - 增加 `-Xmx` 和 `-Xms` 值

2. **禁用不必要的插件**：
   - File → Settings → Plugins
   - 禁用不需要的插件

### 2. 项目性能优化
1. **使用缓存**：
   - 确保 Redis 服务正在运行
   - 检查缓存配置

2. **数据库优化**：
   - 使用 Django ORM 的 select_related 和 prefetch_related
   - 为频繁查询的字段添加索引

3. **代码优化**：
   - 使用 PyCharm 的代码检查功能
   - 遵循 PEP 8 编码规范

## 八、总结

本文档提供了在 PyCharm 中设置、运行、测试和部署 zhang 项目的详细步骤。通过按照这些步骤操作，您可以：

1. **快速设置项目**：在 PyCharm 中正确导入和配置项目
2. **运行开发服务器**：启动 Django 开发服务器和前端开发服务器
3. **执行测试**：运行单元测试和集成测试
4. **使用 Docker**：通过 Docker Compose 运行完整的项目栈
5. **部署项目**：配置 Nginx 并部署到生产环境
6. **调试和优化**：使用 PyCharm 的调试工具和性能优化技巧

如果遇到任何问题，请参考 "常见问题与解决方案" 部分，或查看项目的其他文档。