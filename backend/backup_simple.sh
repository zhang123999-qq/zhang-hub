#!/bin/bash
# backup_simple.sh - 极简备份

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

echo "📦 开始备份..."

# 备份数据库
echo "备份数据库..."
mysqldump -u root -h 192.168.1.5 codesechub > $BACKUP_DIR/db_backup.sql

# 备份媒体文件
echo "备份媒体文件..."
tar -czf $BACKUP_DIR/media.tar.gz media/

# 备份关键配置
echo "备份配置文件..."
cp backend/settings.py $BACKUP_DIR/
cp requirements.txt $BACKUP_DIR/

echo "✅ 备份完成: $BACKUP_DIR"
echo "恢复命令: mysql -u root -h 192.168.1.5 codesechub < $BACKUP_DIR/db_backup.sql"
