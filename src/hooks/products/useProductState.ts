import { useState } from 'react';

export interface ProductLoadingState {
  isInitialLoading: boolean;    // 首次加载
  isRefreshing: boolean;        // 手动刷新
  isFetching: boolean;          // 后台重新获取
}

export interface ProductError {
  code: 'FETCH_ERROR' | 'AUTH_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: any;
}

export function useProductState() {
  // 加载状态
  const [loadingState, setLoadingState] = useState<ProductLoadingState>({
    isInitialLoading: false,
    isRefreshing: false,
    isFetching: false,
  });

  // 错误状态
  const [error, setError] = useState<ProductError | null>(null);

  const startLoading = (type: keyof ProductLoadingState) => {
    setLoadingState(prev => ({ ...prev, [type]: true }));
  };

  const stopLoading = (type: keyof ProductLoadingState) => {
    setLoadingState(prev => ({ ...prev, [type]: false }));
  };

  const handleError = (error: any): ProductError => {
    let productError: ProductError = {
      code: 'FETCH_ERROR',
      message: '获取数据失败',
      details: error
    };

    if (error.message?.includes('auth') || error.message?.includes('user')) {
      productError = {
        code: 'AUTH_ERROR',
        message: '用户未登录或会话已过期',
        details: error
      };
    } else if (error.message?.includes('network') || error.message?.includes('connection')) {
      productError = {
        code: 'NETWORK_ERROR',
        message: '网络连接失败',
        details: error
      };
    }

    setError(productError);
    return productError;
  };

  const clearError = () => setError(null);

  return {
    loadingState,
    error,
    startLoading,
    stopLoading,
    handleError,
    clearError,
    // 便捷的状态访问
    isLoading: Object.values(loadingState).some(Boolean),
    isInitialLoading: loadingState.isInitialLoading,
    isRefreshing: loadingState.isRefreshing,
    isFetching: loadingState.isFetching,
  };
} 