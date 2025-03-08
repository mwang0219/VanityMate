import { ProductRepository } from '@/lib/supabase/repositories/products';
import { Product } from '@/lib/supabase/types';
import { TestCase } from '@/types/test';
import { runTest } from './test-utils';
import { getTestConfig } from '@/config/test.config';
import { supabase } from '@/lib/supabase/client';

const productRepo = new ProductRepository();
const testConfig = getTestConfig();

// 打印测试配置
console.log('Test configuration:', {
  categoryId: testConfig.categoryId,
  subcategoryId: testConfig.subcategoryId,
  subcategoryIdType: typeof testConfig.subcategoryId,
  productDefaults: testConfig.productDefaults
});

const createTestProduct = (): Partial<Product> => {
  const product = {
    name: testConfig.productDefaults.name,
    brand: testConfig.productDefaults.brand,
    description: testConfig.productDefaults.description,
    category_id: testConfig.categoryId,
    subcategory_id: Number(testConfig.subcategoryId), // 确保是数字类型
    pao: testConfig.productDefaults.pao
  };
  
  console.log('Creating product with data:', product);
  console.log('subcategory_id type:', typeof product.subcategory_id);
  return product;
};

// 暂时注释掉 user_products 相关代码
/*
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
*/

export const getProductTests = (): TestCase[] => {
  let createdProductId: string;
  // let createdUserProductId: string;

  return [
    {
      name: 'Create Product',
      run: async () => {
        const result = await runTest('创建产品', async () => {
          // 只创建基础产品
          const product = await productRepo.create(createTestProduct());
          createdProductId = product.id;
          return product;
        });
        return result;
      }
    },
    {
      name: 'Read Product',
      run: async () => {
        return runTest('读取产品', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          
          // 只读取基础产品信息
          const product = await productRepo.findOne(createdProductId);
          return product;
        });
      }
    },
    {
      name: 'Update Product',
      run: async () => {
        return runTest('更新产品', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          
          // 更新产品基本信息
          const updatedProduct = await productRepo.update(createdProductId, {
            name: testConfig.productDefaults.name + ' (已更新)',
            description: testConfig.productDefaults.description + ' (已更新)'
          });
          return updatedProduct;
        });
      }
    },
    {
      name: 'Delete Product',
      run: async () => {
        return runTest('删除产品', async () => {
          if (!createdProductId) {
            throw new Error('没有可用的产品ID');
          }
          
          // 只删除基础产品
          await productRepo.delete(createdProductId);
          
          // 验证删除
          const product = await productRepo.findOne(createdProductId);
          if (product) throw new Error('产品删除失败');
          
          return { message: '产品已成功删除' };
        });
      }
    }
  ];
}; 