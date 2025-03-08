export type TestResult = {
  success: boolean;
  message: string;
  data?: any;
  error?: Error;
};

export type TestCase = {
  name: string;
  run: () => Promise<TestResult>;
}; 