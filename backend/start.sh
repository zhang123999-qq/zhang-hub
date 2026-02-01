#!/bin/bash
# start.sh - 极简启动脚本

# 激活虚拟环境
source venv/bin/activate

# 设置环境变量
export DJANGO_SETTINGS_MODULE=backend.settings
export DB_HOST=192.168.1.5
export DB_USER=root
export DB_PASSWORD=

# 启动服务
python manage.py runserver 0.0.0.0:8000
