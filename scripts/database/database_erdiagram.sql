-- VanityMate 数据库结构
-- 创建时间: 2024-03-07

-- 用户表
create table users (
  id uuid primary key,  -- 原为 references auth.users(id)
  username text,
  email text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 产品状态映射表
create table product_status (
  id integer primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 产品类别映射表
create table product_category (
  id text primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 产品子类别映射表
create table product_subcategory (
  id integer primary key,
  category_id text references product_category(id),
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, name)
);

-- 产品表（基础产品信息）
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text,
  category_id text references product_category(id),
  subcategory_id integer references product_subcategory(id),
  description text,
  image_url text,
  pao integer check (pao >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 用户产品关联表（用户特定的产品信息）
create table user_products (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  status integer references product_status(id),
  batch_code text,
  purchase_date date,
  open_date date,
  expiry_date date,
  image_url text,
  is_favorite boolean default false,
  last_used_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- 添加业务逻辑约束
  constraint open_date_after_purchase check (open_date >= purchase_date),
  constraint expiry_date_after_purchase check (expiry_date >= purchase_date),
  unique(user_id, product_id)
);

-- 插入基础状态数据
insert into product_status (id, name, description) values
  (1, 'unopened', '未开封'),
  (2, 'in_use', '使用中'),
  (3, 'finished', '已用完');

-- 插入基础类别数据
insert into product_category (id, name, description) values
  ('BASE', '底妆', '粉底、遮瑕等底妆产品'),
  ('EYE', '眼部彩妆', '眼影、睫毛膏等眼部产品'),
  ('LIP', '唇部彩妆', '口红、唇釉等唇部产品'),
  ('SKINCARE', '护肤', '护肤品类'),
  ('FRAGRANCE', '香水', '香水和香氛'),
  ('TOOLS', '工具', '化妆工具和配件');

-- 插入基础子类别数据
insert into product_subcategory (id, category_id, name, description) values
  -- 底妆子类别
  (1, 'BASE', 'foundation', '粉底'),
  (2, 'BASE', 'concealer', '遮瑕'),
  (3, 'BASE', 'powder', '散粉/粉饼'),
  -- 眼部彩妆子类别
  (4, 'EYE', 'eyeshadow', '眼影'),
  (5, 'EYE', 'mascara', '睫毛膏'),
  (6, 'EYE', 'eyeliner', '眼线'),
  -- 唇部彩妆子类别
  (7, 'LIP', 'lipstick', '口红'),
  (8, 'LIP', 'lip_gloss', '唇釉'),
  (9, 'LIP', 'lip_balm', '润唇膏'),
  -- 护肤子类别
  (10, 'SKINCARE', 'cleanser', '清洁类'),
  (11, 'SKINCARE', 'toner', '化妆水'),
  (12, 'SKINCARE', 'serum', '精华'),
  (13, 'SKINCARE', 'moisturizer', '面霜'),
  (14, 'SKINCARE', 'sunscreen', '防晒'),
  -- 香水子类别
  (15, 'FRAGRANCE', 'perfume', '香水'),
  (16, 'FRAGRANCE', 'cologne', '古龙水'),
  -- 工具子类别
  (17, 'TOOLS', 'brush', '化妆刷'),
  (18, 'TOOLS', 'puff', '粉扑'); 