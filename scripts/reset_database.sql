-- 首先删除所有相关的触发器
DROP TRIGGER IF EXISTS validate_product_subcategory_trigger ON products;
DROP TRIGGER IF EXISTS set_open_date_trigger ON user_products;
DROP TRIGGER IF EXISTS calculate_expiry_date_trigger ON user_products;
DROP TRIGGER IF EXISTS update_user_products_updated_at ON user_products;

-- 删除所有相关的函数
DROP FUNCTION IF EXISTS validate_product_subcategory();
DROP FUNCTION IF EXISTS set_open_date();
DROP FUNCTION IF EXISTS calculate_expiry_date();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 删除所有相关的策略
DROP POLICY IF EXISTS "用户只能查看和编辑自己的个人资料" ON users;
DROP POLICY IF EXISTS "认证用户可以查看产品状态" ON product_status;
DROP POLICY IF EXISTS "认证用户可以查看产品类别" ON product_category;
DROP POLICY IF EXISTS "认证用户可以查看产品子类别" ON product_subcategory;
DROP POLICY IF EXISTS "认证用户可以查看产品" ON products;
DROP POLICY IF EXISTS "认证用户可以创建产品" ON products;
DROP POLICY IF EXISTS "用户只能查看自己的产品关联" ON user_products;
DROP POLICY IF EXISTS "用户只能创建自己的产品关联" ON user_products;
DROP POLICY IF EXISTS "用户只能更新自己的产品关联" ON user_products;
DROP POLICY IF EXISTS "用户只能删除自己的产品关联" ON user_products;

-- 按照依赖关系顺序删除表
DROP TABLE IF EXISTS user_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_subcategory;
DROP TABLE IF EXISTS product_category;
DROP TABLE IF EXISTS product_status;
DROP TABLE IF EXISTS users; 