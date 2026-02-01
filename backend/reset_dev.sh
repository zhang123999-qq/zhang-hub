#!/bin/bash
# reset_dev.sh - 快速重置开发环境

echo "🔄 重置开发环境..."

# 删除并重建数据库
echo "重建数据库..."
mysql -u root -h 192.168.1.5 -e "DROP DATABASE IF EXISTS codesechub; CREATE DATABASE codesechub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 重新迁移
echo "数据库迁移..."
python manage.py migrate

# 创建测试数据
echo "创建测试数据..."
python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
User = get_user_model()

# 创建管理员
admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
admin.role = 'admin'
admin.save()

# 创建测试用户
for i in range(1, 6):
    user = User.objects.create_user(
        username=f'user{i}',
        email=f'user{i}@example.com',
        password='test123'
    )
    user.role = 'user' if i < 4 else 'researcher'
    user.save()
    
print("✅ 测试数据创建完成")
EOF

echo "🎉 环境重置完成！"
echo "管理员账号: admin / admin123"
