import { TestResult } from '@/types/test';

export async function runTest(
  name: string,
  testFn: () => Promise<any>
): Promise<TestResult> {
  try {
    const data = await testFn();
    return {
      success: true,
      message: `${name} 测试成功`,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `${name} 测试失败`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
} 