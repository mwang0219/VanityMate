import Constants from 'expo-constants';

// 测试环境配置
interface TestConfig {
  userId: string;
  categoryId: string;
  productDefaults: {
    name: string;
    brand: string;
    description: string;
  };
}

// 从 app.config.js 的 extra 中获取配置
// 如果在开发环境，使用默认值
const testConfig: TestConfig = {
  userId: Constants.expoConfig?.extra?.testUserId || 'fe0f741a-25a4-49c0-bdaa-d7e3d642e84f',
  categoryId: Constants.expoConfig?.extra?.testCategoryId || 'FRAGRANCE',
  productDefaults: {
    name: '测试产品',
    brand: '测试品牌',
    description: '用于测试的产品'
  }
};

export const getTestConfig = () => testConfig; 