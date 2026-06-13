-- =============================================
-- 创建 users 表（用户配置）
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#4F46E5',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- 插入初始用户数据
INSERT INTO users (name, color) VALUES
('用户1', '#4F46E5'),
('用户2', '#10B981'),
('用户3', '#F59E0B'),
('用户4', '#EF4444'),
('用户5', '#8B5CF6');

-- 查看用户数据
SELECT * FROM users;
