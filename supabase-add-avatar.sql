-- 添加 avatar_url 字段到 users 表
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
