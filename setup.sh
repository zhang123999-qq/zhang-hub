#!/bin/bash

# CodeSecHub 一键安装启动脚本
# 功能：解压、安装依赖、启动服务、注册系统服务

set -e

echo "========================================"
echo "CodeSecHub 一键安装启动脚本"
echo "========================================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "错误：请使用root用户运行此脚本"
    exit 1
fi

# 检查系统类型
if [ ! -f /etc/os-release ]; then
    echo "错误：不支持的操作系统"
    exit 1
fi

# 安装必要的系统依赖
echo "正在安装系统依赖..."

# 检测包管理器
if [ -x "$(command -v apt)" ]; then
    # Debian/Ubuntu
    apt update -y
    apt install -y python3 python3-pip python3-venv nodejs npm git nginx curl
elif [ -x "$(command -v yum)" ]; then
    # CentOS/RHEL
    yum update -y
    yum install -y python3 python3-pip python3-venv nodejs npm git nginx curl
    # 启用EPEL仓库（如果需要）
    if ! rpm -q epel-release; then
        yum install -y epel-release
    fi
elif [ -x "$(command -v dnf)" ]; then
    # Fedora
    dnf update -y
    dnf install -y python3 python3-pip python3-venv nodejs npm git nginx curl
else
    echo "错误：不支持的包管理器"
    exit 1
fi

# 创建安装目录
INSTALL_DIR="/opt/codesechub"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# 解压项目文件（假设脚本与压缩包在同一目录）
if [ -f "../codesechub.tar.gz" ]; then
    echo "正在解压项目文件..."
    tar -xzf "../codesechub.tar.gz" -C .
elif [ -f "codesechub.tar.gz" ]; then
    echo "正在解压项目文件..."
    tar -xzf "codesechub.tar.gz" -C .
else
    echo "错误：未找到项目压缩包 codesechub.tar.gz"
    exit 1
fi

# 安装后端依赖
echo "正在安装后端依赖..."
cd "backend"

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装pip依赖
pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "错误：未找到 requirements.txt 文件"
    exit 1
fi

# 初始化数据库
echo "正在初始化数据库..."
python manage.py migrate

# 创建默认超级用户
echo "正在创建默认超级用户..."
python -c "
import os
import django

# 设置Django环境
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

# 检查是否已存在超级用户
if not User.objects.filter(is_superuser=True).exists():
    # 创建默认超级用户
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    print('默认超级用户创建成功: admin/admin123')
else:
    print('超级用户已存在，跳过创建')
"


# 安装前端依赖
echo "正在安装前端依赖..."
cd "../frontend"
npm install
npm run build

# 配置Nginx
echo "正在配置Nginx..."
cat > /etc/nginx/conf.d/codesechub.conf << EOF
server {
    listen 80;
    server_name localhost;

    location / {
        root /opt/codesechub/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 重启Nginx
systemctl restart nginx
systemctl enable nginx

# 创建后端服务系统服务文件
echo "正在创建后端服务系统服务..."
cat > /etc/systemd/system/codesechub-backend.service << EOF
[Unit]
Description=CodeSecHub Backend Service
After=network.target

[Service]
User=root
WorkingDirectory=/opt/codesechub/backend
ExecStart=/opt/codesechub/backend/venv/bin/python manage.py runserver 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 启动并启用后端服务
systemctl daemon-reload
systemctl start codesechub-backend
systemctl enable codesechub-backend

# 验证服务状态
echo "正在验证服务状态..."
sleep 5

echo "========================================"
echo "服务状态检查"
echo "========================================"
systemctl status nginx --no-pager
echo ""
systemctl status codesechub-backend --no-pager
echo ""

# 检查端口占用
netstat -tuln | grep -E '80|8000'
echo ""

# 输出安装完成信息
echo "========================================"
echo "安装完成！"
echo "========================================"
echo "前端访问地址: http://localhost"
echo "后端API地址: http://localhost/api/"
echo "管理后台: http://localhost/api/admin/"
echo ""
echo "默认超级用户: admin"
echo "默认密码: admin123"
echo ""
echo "如需修改配置，请编辑以下文件:"
echo "- Nginx配置: /etc/nginx/conf.d/codesechub.conf"
echo "- 后端服务配置: /etc/systemd/system/codesechub-backend.service"
echo "- 后端项目配置: /opt/codesechub/backend/backend/settings.py"
echo ""
echo "脚本执行完成！"
echo "========================================"