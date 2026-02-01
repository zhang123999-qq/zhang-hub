#!/bin/bash
# deploy.sh - 一键部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署 CodeSecHub 系统..."

# 1. 检查环境
echo "📋 检查环境..."
python --version
pip --version

# 2. 安装Python依赖
echo "📦 安装Python依赖..."
pip install -r requirements.txt

# 3. 数据库迁移
echo "🗄️  数据库迁移..."
python manage.py makemigrations
python manage.py migrate

# 4. 创建超级用户（如果不存在）
echo "👑 创建管理员账户..."
if ! python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123')"; then
    echo "⚠️  管理员已存在或创建失败"
fi

# 5. 收集静态文件
echo "📁 收集静态文件..."
python manage.py collectstatic --noinput

# 6. 启动服务（开发环境）
echo "🚀 启动开发服务器..."
echo "==============================="
echo "🌐 后台管理地址：http://localhost:8000/admin/"
echo "👤 管理员账号：admin"
echo "🔑 管理员密码：admin123"
echo "==============================="
python manage.py runserver 0.0.0.0:8000
