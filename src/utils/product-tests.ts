import { ProductRepository } from '@/lib/supabase/repositories/products';
import { Product } from '@/lib/supabase/types';
import { TestCase } from '@/types/test';
import { runTest } from './test-utils';
import { getTestConfig } from '@/config/test.config';
import { supabase } from '@/lib/supabase/client';

const productRepo = new ProductRepository();
const testConfig = getTestConfig();

const createTestProduct = (): Partial<Product> => ({
  name: testConfig.productDefaults.name,
  brand: testConfig.productDefaults.brand,
  description: testConfig.productDefaults.description,
  category_id: testConfig.categoryId,
  subcategory_id: testConfig.subcategoryId,
  pao: testConfig.productDefaults.pao
});

const createUserProduct = async (productId: string) => {
  const { data, error } = await supabase
    .from('user_products')
    .insert({
      user_id: testConfig.userId,
      product_id: productId,
      status: 1, // unopened
      purchase_date: new Date().toISOString().split('T')[0], // 只要日期部分
      is_favorite: false,
      notes: '测试产品'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProductTests = (): TestCase[] => {
  let createdProductId: string;
  let createdUserProductId: string;

  return [
    {
      name: 'Create Product',
      run: async () => {
        const result = await runTest('创建产品', async () => {
          // 1. 创建基础产品
          const product = await productRepo.create(createTestProduct());
          createdProductId = product.id;
          
          // 2. 创建用户产品关联
          const userProduct = await createUserProduct(product.id);
          createdUserProductId = userProduct.id;
          
          return { product, userProduct };
        });
        return result;
      }
    },
    {
      name: 'Read Product',
      run: async () => {
        return runTest('读取产品', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          
          // 1. 读取基础产品信息
          const product = await productRepo.findOne(createdProductId);
          
          // 2. 读取用户产品关联信息
          const { data: userProduct } = await supabase
            .from('user_products')
            .select('*')
            .eq('product_id', createdProductId)
            .eq('user_id', testConfig.userId)
            .single();
            
          return { product, userProduct };
        });
      }
    },
    {
      name: 'Update Product Status',
      run: async () => {
        return runTest('更新产品状态', async () => {
          if (!createdUserProductId) throw new Error('没有可用的用户产品ID');
          
          // 更新用户产品状态
          const { data: updatedUserProduct, error } = await supabase
            .from('user_products')
            .update({ status: 2 }) // 改为 in_use
            .eq('id', createdUserProductId)
            .select()
            .single();
            
          if (error) throw error;
          return updatedUserProduct;
        });
      }
    },
    {
      name: 'Delete Product',
      run: async () => {
        return runTest('删除产品', async () => {
          if (!createdProductId || !createdUserProductId) {
            throw new Error('没有可用的产品ID');
          }
          
          // 1. 删除用户产品关联
          await supabase
            .from('user_products')
            .delete()
            .eq('id', createdUserProductId);
          
          // 2. 删除基础产品
          await productRepo.delete(createdProductId);
          
          // 3. 验证删除
          const product = await productRepo.findOne(createdProductId);
          if (product) throw new Error('产品删除失败');
          
          return { message: '产品已成功删除' };
        });
      }
    }
  ];
}; 