-- =============================================
-- 更新 transactions 表，添加 user_id 字段
-- =============================================

-- 添加 user_id 字段
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id BIGINT DEFAULT 1;

-- 添加外键约束
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- 更新现有数据的 user_id（如果为空）
UPDATE transactions SET user_id = 1 WHERE user_id IS NULL;

-- 查看更新结果
SELECT user_id, COUNT(*) FROM transactions GROUP BY user_id;
