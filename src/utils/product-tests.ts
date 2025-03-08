import { ProductRepository } from '@/lib/supabase/repositories/products';
import { Product, UserProduct } from '@/lib/supabase/types';
import { TestCase } from '@/types/test';
import { runTest } from './test-utils';
import { getTestConfig } from '@/config/test.config';
import { supabase } from '@/lib/supabase/client';

const productRepo = new ProductRepository();
const testConfig = getTestConfig();

const createTestProduct = (): Partial<Product> => {
  const product = {
    name: testConfig.productDefaults.name,
    brand: testConfig.productDefaults.brand,
    description: testConfig.productDefaults.description,
    category_id: testConfig.categoryId,
    subcategory_id: Number(testConfig.subcategoryId),
    pao: testConfig.productDefaults.pao
  };
  return product;
};

const createUserProduct = async (productId: string): Promise<UserProduct> => {
  const userProduct = {
    user_id: testConfig.userId,
    product_id: productId,
    status: 1, // unopened
    purchase_date: new Date().toISOString().split('T')[0],
    is_favorite: false,
    notes: '测试产品'
  };

  const { data, error } = await supabase
    .from('user_products')
    .insert(userProduct)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('创建用户产品失败：没有返回数据');
  return data;
};

// 格式化产品数据
const formatProductData = (product: Product) => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  description: product.description,
  category_id: product.category_id,
  subcategory_id: product.subcategory_id,
  pao: product.pao
});

// 格式化用户产品数据
const formatUserProductData = (userProduct: UserProduct) => ({
  id: userProduct.id,
  user_id: userProduct.user_id,
  product_id: userProduct.product_id,
  status: userProduct.status,
  purchase_date: userProduct.purchase_date,
  is_favorite: userProduct.is_favorite,
  notes: userProduct.notes
});

// 格式化测试结果
const formatTestResult = (type: string, data: any) => {
  return {
    type,
    data: {
      ...data,
      timestamp: new Date().toISOString()
    }
  };
};

export const getProductTests = (): TestCase[] => {
  let createdProductId: string;
  let createdUserProductId: string;

  return [
    {
      name: 'Create Product',
      run: async () => {
        const result = await runTest('创建产品和用户产品关联', async () => {
          // 1. 创建基础产品
          const product = await productRepo.create(createTestProduct());
          if (!product) throw new Error('创建产品失败：没有返回数据');
          
          createdProductId = product.id;
          
          // 2. 创建用户产品关联
          const userProduct = await createUserProduct(product.id);
          createdUserProductId = userProduct.id;
          
          return formatTestResult('create', {
            product: formatProductData(product),
            userProduct: formatUserProductData(userProduct)
          });
        });
        return result;
      }
    },
    {
      name: 'Read Product',
      run: async () => {
        return runTest('读取产品和用户产品关联', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          
          // 1. 读取基础产品信息
          const product = await productRepo.findOne(createdProductId);
          if (!product) throw new Error('读取产品失败：产品不存在');
          
          // 2. 读取用户产品关联信息
          const { data: userProduct, error } = await supabase
            .from('user_products')
            .select('*')
            .eq('product_id', createdProductId)
            .eq('user_id', testConfig.userId)
            .single();
            
          if (error) throw error;
          if (!userProduct) throw new Error('读取用户产品失败：数据不存在');
          
          return formatTestResult('read', {
            product: formatProductData(product),
            userProduct: formatUserProductData(userProduct)
          });
        });
      }
    },
    {
      name: 'Update Product',
      run: async () => {
        return runTest('更新产品和用户产品关联', async () => {
          if (!createdProductId || !createdUserProductId) {
            throw new Error('没有可用的产品ID');
          }
          
          // 1. 更新基础产品信息
          const updatedProduct = await productRepo.update(createdProductId, {
            name: testConfig.productDefaults.name + ' (已更新)',
            description: testConfig.productDefaults.description + ' (已更新)'
          });
          if (!updatedProduct) throw new Error('更新产品失败：没有返回数据');
          
          // 2. 更新用户产品信息
          const { data: updatedUserProduct, error } = await supabase
            .from('user_products')
            .update({ 
              status: 2, // in_use
              notes: '测试产品 (已更新)'
            })
            .eq('id', createdUserProductId)
            .select()
            .single();
            
          if (error) throw error;
          if (!updatedUserProduct) throw new Error('更新用户产品失败：没有返回数据');
          
          return formatTestResult('update', {
            product: formatProductData(updatedProduct),
            userProduct: formatUserProductData(updatedUserProduct)
          });
        });
      }
    },
    {
      name: 'Delete Product',
      run: async () => {
        return runTest('删除产品和用户产品关联', async () => {
          if (!createdProductId || !createdUserProductId) {
            throw new Error('没有可用的产品ID');
          }
          
          // 1. 删除用户产品关联
          const { error: userProductError } = await supabase
            .from('user_products')
            .delete()
            .eq('id', createdUserProductId);
            
          if (userProductError) throw userProductError;
          
          // 2. 删除基础产品
          await productRepo.delete(createdProductId);
          
          // 3. 验证删除
          const [productCheck, userProductCheck] = await Promise.all([
            supabase
              .from('products')
              .select('id')
              .eq('id', createdProductId),
            supabase
              .from('user_products')
              .select('id')
              .eq('id', createdUserProductId)
          ]);
          
          if (productCheck.error) throw productCheck.error;
          if (userProductCheck.error) throw userProductCheck.error;
          
          if (
            (productCheck.data && productCheck.data.length > 0) ||
            (userProductCheck.data && userProductCheck.data.length > 0)
          ) {
            throw new Error('产品或用户产品关联删除失败');
          }
          
          return formatTestResult('delete', {
            deletedIds: {
              productId: createdProductId,
              userProductId: createdUserProductId
            },
            message: '产品及其关联数据已成功删除'
          });
        });
      }
    }
  ];
}; 