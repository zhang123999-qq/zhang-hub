# GitHub发布指南

本指南详细介绍如何将CodeSecHub项目发布到GitHub平台。

## 一、准备工作

### 1. 前提条件
- 已安装Git客户端
- 已注册GitHub账号
- 已完成项目清理和打包（参考setup.sh脚本）

### 2. 项目文件结构
确保项目文件结构如下：
```
CodeSecHub/
├── backend/          # 后端Python代码
├── frontend/         # 前端Vue3代码
├── setup.sh          # Linux一键部署脚本
└── GITHUB_PUBLISH_GUIDE.md  # 本指南
```

## 二、GitHub仓库创建

### 1. 登录GitHub
访问 https://github.com 并登录您的账号。

### 2. 创建新仓库
1. 点击右上角的"+"按钮，选择"New repository"
2. 填写仓库信息：
   - **Repository name**: 建议使用 "CodeSecHub"
   - **Description**: 填写项目描述，例如 "代码安全知识共享平台"
   - **Visibility**: 选择 "Public" 或 "Private"
   - **Initialize this repository with**: 不要勾选任何选项
3. 点击 "Create repository" 按钮

## 三、本地仓库初始化与推送

### 1. 初始化本地Git仓库
打开终端或命令提示符，进入项目目录：

```bash
# 进入项目目录
cd /path/to/CodeSecHub

# 初始化Git仓库
git init

# 配置用户名和邮箱
git config user.name "Your GitHub Username"
git config user.email "your.email@example.com"

# 创建.gitignore文件
echo "# 依赖目录
node_modules/
venv/

# 编译产物
dist/

# 测试文件
tests/
__pycache__/

# 数据库文件
db.sqlite3

# 环境配置文件
.env
.env.local
.env.*.local

# 日志文件
*.log

# 压缩包
*.zip
*.tar.gz

# IDE配置
.vscode/
.idea/
*.swp
*.swo
*~
" > .gitignore
```

### 2. 添加文件并提交

```bash
# 添加所有文件
git add .

# 提交初始版本
git commit -m "Initial commit: CodeSecHub project"
```

### 3. 关联远程仓库并推送

```bash
# 关联GitHub远程仓库（替换为您的仓库URL）
git remote add origin https://github.com/your-username/CodeSecHub.git

# 推送代码到GitHub
git push -u origin main
```

### 4. 推送压缩包（可选）
如果需要将打包好的项目压缩包也上传到GitHub，可以创建一个发布版本：

1. 登录GitHub，进入仓库页面
2. 点击 "Releases" 标签
3. 点击 "Draft a new release"
4. 填写发布信息：
   - **Tag version**: 例如 "v1.0.0"
   - **Release title**: 例如 "Initial Release"
   - **Description**: 填写发布说明
5. 上传压缩包文件（codesechub.zip）
6. 点击 "Publish release"

## 四、GitHub Actions自动化部署（可选）

### 1. 创建CI/CD配置文件
在项目根目录创建 `.github/workflows` 目录，并添加以下文件：

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy CodeSecHub

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'

    - name: Install backend dependencies
      run: |
        cd backend
        python -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt

    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install

    - name: Build frontend
      run: |
        cd frontend
        npm run build

    - name: Test deployment script
      run: |
        cd ..
        chmod +x setup.sh
        echo "Deployment script is ready"
```

### 2. 配置完成
提交CI/CD配置文件：

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD workflow"
git push
```

## 五、常见问题解决

### 1. Git推送失败
- **问题**: `fatal: remote origin already exists.`
- **解决**: 先删除已存在的远程仓库，再重新关联
  ```bash
  git remote remove origin
  git remote add origin https://github.com/your-username/CodeSecHub.git
  ```

### 2. 权限错误
- **问题**: `remote: Permission to your-username/CodeSecHub.git denied to your-username.`
- **解决**: 检查GitHub账号权限，确保使用正确的账号和认证方式

### 3. 大文件推送失败
- **问题**: `error: RPC failed; curl 92 HTTP/2 stream 0 was reset`
- **解决**: 配置Git大文件传输限制
  ```bash
  git config --global http.postBuffer 524288000
  ```

## 六、后续维护

### 1. 代码更新流程
```bash
# 拉取最新代码
git pull

# 进行代码修改

# 提交更改
git add .
git commit -m "Update: 描述您的更改"

# 推送更新
git push
```

### 2. 分支管理
```bash
# 创建新分支
git checkout -b feature/new-feature

# 切换回主分支
git checkout main

# 合并分支
git merge feature/new-feature
```

### 3. 标签管理
```bash
# 创建标签
git tag -a v1.0.1 -m "Version 1.0.1"

# 推送标签
git push origin v1.0.1
```

## 七、联系方式

如果在发布过程中遇到任何问题，请参考GitHub官方文档或联系项目维护者。

---

**发布完成后，您的项目将可以通过以下地址访问：**
- GitHub仓库：`https://github.com/your-username/CodeSecHub`
- 项目部署：可使用 `setup.sh` 脚本在Linux服务器上一键部署

祝您发布顺利！