-- VanityMate 数据库结构
-- 创建时间: 2024-03-07

-- 用户表
create table users (
  id uuid references auth.users on delete cascade,
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
  id integer primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 产品子类别映射表
create table product_subcategory (
  id integer primary key,
  category_id integer references product_category(id),
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
  category_id integer references product_category(id),
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
  (1, 'makeup', '彩妆'),
  (2, 'skincare', '护肤'),
  (3, 'fragrance', '香水'),
  (4, 'tools', '工具');

-- 插入基础子类别数据
insert into product_subcategory (id, category_id, name, description) values
  -- 彩妆子类别
  (1, 1, 'lip', '唇部彩妆'),
  (2, 1, 'eye', '眼部彩妆'),
  (3, 1, 'face', '面部彩妆'),
  -- 护肤子类别
  (4, 2, 'cleanser', '清洁类'),
  (5, 2, 'toner', '化妆水'),
  (6, 2, 'serum', '精华'),
  (7, 2, 'moisturizer', '面霜'),
  (8, 2, 'sunscreen', '防晒'),
  -- 香水子类别
  (9, 3, 'perfume', '香水'),
  (10, 3, 'cologne', '古龙水'),
  -- 工具子类别
  (11, 4, 'brush', '化妆刷'),
  (12, 4, 'puff', '粉扑');

-- 验证子类别的函数
create or replace function validate_product_subcategory()
returns trigger as $$
begin
  -- 如果子类别为空，允许
  if NEW.subcategory_id is null then
    return NEW;
  end if;
  
  -- 验证子类别是否属于正确的类别
  if not exists (
    select 1 from product_subcategory 
    where id = NEW.subcategory_id 
    and category_id = NEW.category_id
  ) then
    raise exception '子类别必须属于选择的类别';
  end if;
  
  return NEW;
end;
$$ language plpgsql;

-- 自动设置开封日期的函数
create or replace function set_open_date()
returns trigger as $$
begin
  -- 当状态改为 "in_use" 且开封日期为空时
  if NEW.status = 2 and NEW.open_date is null then
    NEW.open_date := current_date;
    -- 同时更新 updated_at
    NEW.updated_at := now();
  end if;
  return NEW;
end;
$$ language plpgsql;

-- 自动计算过期日期的函数
create or replace function calculate_expiry_date()
returns trigger as $$
declare
  product_pao integer;
begin
  -- 获取产品的 PAO
  select pao into product_pao from products where id = NEW.product_id;
  -- 当开封日期有值且产品有 PAO 时
  if NEW.open_date is not null and product_pao is not null then
    NEW.expiry_date := NEW.open_date + (product_pao * interval '1 month');
    -- 同时更新 updated_at
    NEW.updated_at := now();
  end if;
  return NEW;
end;
$$ language plpgsql;

-- 自动更新 updated_at 的函数
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- 创建触发器
create trigger validate_product_subcategory_trigger
  before insert or update of category_id, subcategory_id
  on products
  for each row
  execute function validate_product_subcategory();

create trigger set_open_date_trigger
  before insert or update of status
  on user_products
  for each row
  execute function set_open_date();

create trigger calculate_expiry_date_trigger
  before insert or update of open_date
  on user_products
  for each row
  execute function calculate_expiry_date();

create trigger update_user_products_updated_at
  before update
  on user_products
  for each row
  execute function update_updated_at_column();

-- 为表启用 RLS
alter table users enable row level security;
alter table product_status enable row level security;
alter table product_category enable row level security;
alter table product_subcategory enable row level security;
alter table products enable row level security;
alter table user_products enable row level security;

-- 创建用户表的策略
create policy "用户只能查看和编辑自己的个人资料"
on users for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- 创建查看类别和状态的策略（所有认证用户都可以查看）
create policy "认证用户可以查看产品状态"
on product_status for select
using (auth.role() = 'authenticated');

create policy "认证用户可以查看产品类别"
on product_category for select
using (auth.role() = 'authenticated');

create policy "认证用户可以查看产品子类别"
on product_subcategory for select
using (auth.role() = 'authenticated');

-- 创建产品表的策略（所有认证用户都可以查看和创建产品）
create policy "认证用户可以查看产品"
on products for select
using (auth.role() = 'authenticated');

create policy "认证用户可以创建产品"
on products for insert
with check (auth.role() = 'authenticated');

-- 创建用户产品关联表的策略
create policy "用户只能查看自己的产品关联"
on user_products for select
using (auth.uid() = user_id);

create policy "用户只能创建自己的产品关联"
on user_products for insert
with check (auth.uid() = user_id);

create policy "用户只能更新自己的产品关联"
on user_products for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "用户只能删除自己的产品关联"
on user_products for delete
using (auth.uid() = user_id); 