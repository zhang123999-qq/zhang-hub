-- init_database.sql - 在192.168.1.5上执行
-- 创建数据库和基本表结构

CREATE DATABASE IF NOT EXISTS codesechub 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE codesechub;

-- 创建极简用户表（备用）
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认管理员（密码：admin123）
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', MD5('admin123'), 'admin@example.com', 'admin')
ON DUPLICATE KEY UPDATE role='admin';
