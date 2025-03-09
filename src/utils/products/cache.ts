import { UserProduct } from '@/lib/supabase/types';

export interface CacheMetadata {
  timestamp: number;
  version: string;
  userId: string;
}

export interface CacheData {
  products: UserProduct[];
  metadata: CacheMetadata;
}

const CACHE_VERSION = '1.0.0';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ProductCache {
  private cache: Map<string, CacheData>;
  
  constructor() {
    this.cache = new Map();
  }

  /**
   * 获取缓存的产品数据
   */
  get(userId: string): UserProduct[] | null {
    const cacheData = this.cache.get(userId);
    
    if (!cacheData) {
      return null;
    }

    // 验证缓存版本
    if (cacheData.metadata.version !== CACHE_VERSION) {
      this.clear(userId);
      return null;
    }

    // 验证缓存是否过期
    if (this.isExpired(cacheData.metadata)) {
      this.clear(userId);
      return null;
    }

    return cacheData.products;
  }

  /**
   * 设置产品数据缓存
   */
  set(userId: string, products: UserProduct[]): void {
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      version: CACHE_VERSION,
      userId
    };

    this.cache.set(userId, {
      products,
      metadata
    });
  }

  /**
   * 清除指定用户的缓存
   */
  clear(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * 清除所有缓存
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * 检查缓存是否存在
   */
  has(userId: string): boolean {
    return this.cache.has(userId);
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(metadata: CacheMetadata): boolean {
    const now = Date.now();
    return now - metadata.timestamp > CACHE_DURATION;
  }

  /**
   * 获取缓存元数据
   */
  getMetadata(userId: string): CacheMetadata | null {
    const cacheData = this.cache.get(userId);
    return cacheData?.metadata || null;
  }

  /**
   * 更新缓存时间戳
   */
  touch(userId: string): void {
    const cacheData = this.cache.get(userId);
    if (cacheData) {
      cacheData.metadata.timestamp = Date.now();
      this.cache.set(userId, cacheData);
    }
  }

  /**
   * 获取缓存状态
   */
  getStatus(userId: string) {
    const cacheData = this.cache.get(userId);
    if (!cacheData) {
      return {
        exists: false,
        isValid: false,
        isExpired: true,
        age: 0
      };
    }

    const now = Date.now();
    const age = now - cacheData.metadata.timestamp;

    return {
      exists: true,
      isValid: cacheData.metadata.version === CACHE_VERSION,
      isExpired: this.isExpired(cacheData.metadata),
      age
    };
  }
}

// 导出单例实例
export const productCache = new ProductCache(); 