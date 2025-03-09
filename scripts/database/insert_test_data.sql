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

-- 添加护肤类测试数据
-- 类别: SKINCARE (护肤)

-- 1. 插入护肤产品信息到 products 表
INSERT INTO products (id, name, brand, category_id, subcategory_id, description, pao)
VALUES 
  -- 精华
  ('44444444-4444-4444-4444-444444444444',
   'Advanced Night Repair',
   'Estee Lauder',
   'SKINCARE',
   12,  -- 精华 serum
   '小棕瓶精华，修护保湿',
   12),
  
  -- 面霜
  ('55555555-5555-5555-5555-555555555555',
   'Hydro Boost Water Gel',
   'Neutrogena',
   'SKINCARE',
   13,  -- 面霜 moisturizer
   '水凝保湿补水面霜',
   12),
  
  -- 防晒
  ('66666666-6666-6666-6666-666666666666',
   'UV Perfect Protection Milk',
   'Anessa',
   'SKINCARE',
   14,  -- 防晒 sunscreen
   '防晒乳液 SPF50+ PA++++',
   12),
  
  -- 精华
  ('77777777-7777-7777-7777-777777777777',
   'Facial Treatment Essence',
   'SK-II',
   'SKINCARE',
   12,  -- 精华 serum
   '神仙水精华液',
   12),
  
  -- 精华
  ('88888888-8888-8888-8888-888888888888',
   'Vitamin C Serum',
   'The Ordinary',
   'SKINCARE',
   12,  -- 精华 serum
   '维生素C精华液',
   6);

-- 2. 插入用户护肤产品关联信息到 user_products 表
INSERT INTO user_products 
  (user_id, product_id, status, purchase_date, open_date, expiry_date, is_favorite, notes)
VALUES
  -- 小棕瓶：未开封状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '44444444-4444-4444-4444-444444444444',
   1, -- unopened
   '2024-03-01',
   NULL,
   '2025-03-01',
   true,
   '网上好评的小棕瓶'),
  
  -- 水凝霜：使用中状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '55555555-5555-5555-5555-555555555555',
   2, -- in_use
   '2024-02-15',
   '2024-02-20',
   '2025-02-15',
   false,
   '夏天用很清爽'),
  
  -- 防晒：使用中状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '66666666-6666-6666-6666-666666666666',
   2, -- in_use
   '2024-01-10',
   '2024-03-01',
   '2025-01-10',
   true,
   '防晒效果很好'),
  
  -- 神仙水：未开封状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '77777777-7777-7777-7777-777777777777',
   1, -- unopened
   '2024-03-05',
   NULL,
   '2025-03-05',
   false,
   '囤货等用'),
  
  -- 维C精华：已用完状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '88888888-8888-8888-8888-888888888888',
   3, -- finished
   '2023-09-01',
   '2023-09-15',
   '2024-03-01',
   false,
   '已用完，效果不错');

-- 添加底妆、眼部彩妆和唇部彩妆测试数据
-- 类别: BASE, EYE, LIP

-- 1. 插入彩妆产品信息到 products 表
INSERT INTO products (id, name, brand, category_id, subcategory_id, description, pao)
VALUES 
  -- 底妆：粉底液
  ('99999999-9999-9999-9999-999999999999',
   'Double Wear',
   'Estee Lauder',
   'BASE',
   1,  -- foundation
   '持久不脱妆粉底液',
   12),
  
  -- 眼部：眼影盘
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Naked3',
   'Urban Decay',
   'EYE',
   4,  -- eyeshadow
   '裸色系眼影盘',
   24),
  
  -- 唇部：口红
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '999',
   'Dior',
   'LIP',
   7,  -- lipstick
   '正红色口红',
   18);

-- 2. 插入用户彩妆产品关联信息到 user_products 表
INSERT INTO user_products 
  (user_id, product_id, status, purchase_date, open_date, expiry_date, is_favorite, notes)
VALUES
  -- 粉底液：使用中状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   '99999999-9999-9999-9999-999999999999',
   2, -- in_use
   '2024-02-01',
   '2024-02-05',
   '2025-02-01',
   true,
   '很适合我的肤色'),
  
  -- 眼影盘：未开封状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   1, -- unopened
   '2024-03-10',
   NULL,
   NULL,
   false,
   '日常百搭款'),
  
  -- 口红：使用中状态
  ('fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   2, -- in_use
   '2024-01-15',
   '2024-01-20',
   '2025-07-15',
   true,
   '最爱的正红色'); 