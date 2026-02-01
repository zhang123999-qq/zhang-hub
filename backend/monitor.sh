#!/bin/bash
# monitor.sh - 极简系统监控

echo "🔍 系统状态检查 - $(date)"

# 检查Django服务
echo "检查Django服务..."
curl -s http://localhost:8000/admin/ > /dev/null && echo "✅ Django服务正常" || echo "❌ Django服务异常"

# 检查数据库表
echo "检查数据库表..."
python manage.py check --database default

# 显示关键统计
echo "📊 关键统计信息:"
python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
from blog.models import Article
from forum.models import Post, Comment
User = get_user_model()

print(f"用户总数: {User.objects.count()}")
print(f"文章总数: {Article.objects.count()}")
print(f"帖子总数: {Post.objects.count()}")
print(f"评论总数: {Comment.objects.count()}")
print(f"活跃用户: {User.objects.filter(is_active=True).count()}")
EOF

echo "✅ 检查完成"
