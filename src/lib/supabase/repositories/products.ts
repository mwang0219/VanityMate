import { BaseRepository } from './base';
import { Product } from '../types';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.findMany(builder => 
      builder.eq('category_id', categoryId)
    );
  }

  async findByUser(userId: string): Promise<Product[]> {
    return this.findMany(builder => 
      builder.eq('user_id', userId)
    );
  }

  async findByUserAndCategory(userId: string, categoryId: string): Promise<Product[]> {
    return this.findMany(builder => 
      builder
        .eq('user_id', userId)
        .eq('category_id', categoryId)
    );
  }

  async findByStatus(userId: string, status: Product['status']): Promise<Product[]> {
    return this.findMany(builder => 
      builder
        .eq('user_id', userId)
        .eq('status', status)
    );
  }

  async updateStatus(id: string, status: Product['status']): Promise<Product> {
    return this.update(id, { 
      status,
      opened_date: status === 'in_use' ? new Date().toISOString() : null
    });
  }
} 