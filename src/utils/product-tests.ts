import { ProductRepository } from '@/lib/supabase/repositories/products';
import { Product } from '@/lib/supabase/types';
import { TestCase } from '@/types/test';
import { runTest } from './test-utils';
import { getTestConfig } from '@/config/test.config';

const productRepo = new ProductRepository();
const testConfig = getTestConfig();

const createTestProduct = (): Partial<Product> => ({
  ...testConfig.productDefaults,
  category_id: testConfig.categoryId,
  user_id: testConfig.userId,
  purchase_date: new Date().toISOString(),
  status: "unopened" as const
});

export const getProductTests = (): TestCase[] => {
  let createdProductId: string;

  return [
    {
      name: 'Create Product',
      run: async () => {
        const result = await runTest('创建产品', async () => {
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