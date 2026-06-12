-- =============================================
-- 记账本数据库表设计
-- =============================================

-- 1. 创建 transactions 表（交易记录）
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL CHECK(amount >= 0),
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- 3. 插入一些测试数据
INSERT INTO transactions (type, amount, category, date, note) VALUES
('income', 8500.00, 'salary', '2026-06-01', '工资收入'),
('expense', 45.50, 'food', '2026-06-02', '午餐'),
('expense', 28.00, 'transport', '2026-06-03', '地铁'),
('expense', 156.00, 'shopping', '2026-06-04', '网购'),
('expense', 3200.00, 'living', '2026-06-05', '房租'),
('income', 500.00, 'other', '2026-06-06', '兼职'),
('expense', 88.00, 'entertainment', '2026-06-07', '电影'),
('expense', 35.00, 'food', '2026-06-08', '早餐'),
('expense', 120.00, 'medical', '2026-06-09', '买药'),
('expense', 66.50, 'food', '2026-06-10', '朋友聚餐');

-- 4. 验证数据
SELECT * FROM transactions ORDER BY date DESC;
