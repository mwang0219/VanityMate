-- 插入测试数据
-- 创建时间: 2024-03-08

-- 为指定用户添加香水类测试数据
-- 用户 ID: fe0f741a-25a4-49c0-bdaa-d7e3d642e84f
-- 类别: FRAGRANCE (香水)

-- 1. 插入基础产品信息到 products 表
INSERT INTO products (id, name, brand, category_id, subcategory_id, description, pao)
VALUES 
  -- 第一个测试产品
  ('11111111-1111-1111-1111-111111111111',
   'Miss Dior Blooming Bouquet',
   'Dior',
   'FRAGRANCE',
   15, -- perfume subcategory
   '清新花香调香水',
   24),
  
  -- 第二个测试产品
  ('22222222-2222-2222-2222-222222222222',
   'Chance Eau Tendre',
   'CHANEL',
   'FRAGRANCE',
   15,
   '柑橘花香调香水',
   36),
  
  -- 第三个测试产品（用于删除测试）
  ('33333333-3333-3333-3333-333333333333',
   'Light Blue',
   'Dolce & Gabbana',
   'FRAGRANCE',
   15,
   '清新柑橘调香水',
   24);

-- 2. 插入用户产品关联信息到 user_products 表
INSERT INTO user_products 
  (user_id, product_id, status, purchase_date, is_favorite, notes)
VALUES
  -- 第一个产品：未开封状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '11111111-1111-1111-1111-111111111111',
   1, -- unopened
   '2024-03-01',
   true,
   '生日礼物'),
  
  -- 第二个产品：使用中状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '22222222-2222-2222-2222-222222222222',
   2, -- in_use
   '2024-02-01',
   false,
   '日常使用'),
  
  -- 第三个产品：用于删除测试
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '33333333-3333-3333-3333-333333333333',
   1, -- unopened
   '2024-03-08',
   false,
   '测试用'); 