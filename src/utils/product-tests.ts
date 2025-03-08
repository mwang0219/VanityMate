import { ProductRepository } from '@/lib/supabase/repositories/products';
import { Product } from '@/lib/supabase/types';
import { TestCase } from '@/types/test';
import { runTest } from './test-utils';

const productRepo = new ProductRepository();

const createTestProduct = (userId: string, categoryId: string): Partial<Product> => ({
  name: "测试产品",
  brand: "测试品牌",
  category_id: categoryId,
  user_id: userId,
  purchase_date: new Date().toISOString(),
  status: "unopened" as const
});

export const getProductTests = (userId: string, categoryId: string): TestCase[] => {
  let createdProductId: string;

  return [
    {
      name: 'Create Product',
      run: async () => {
        const result = await runTest('创建产品', async () => {
          const product = await productRepo.create(createTestProduct(userId, categoryId));
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
          return await productRepo.findOne(createdProductId);
        });
      }
    },
    {
      name: 'Update Product Status',
      run: async () => {
        return runTest('更新产品状态', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          return await productRepo.updateStatus(createdProductId, 'in_use');
        });
      }
    },
    {
      name: 'Delete Product',
      run: async () => {
        return runTest('删除产品', async () => {
          if (!createdProductId) throw new Error('没有可用的产品ID');
          await productRepo.delete(createdProductId);
          const deletedProduct = await productRepo.findOne(createdProductId);
          if (deletedProduct) throw new Error('产品删除失败');
          return { message: '产品已成功删除' };
        });
      }
    }
  ];
}; 