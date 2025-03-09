import React, { useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { SwipeableRow, type SwipeAction } from '../common/SwipeableRow';
import { showConfirmationDialog } from '../common/ConfirmationDialog';
import { colors } from '@/constants/theme';
import { useProducts } from '@/contexts/ProductsContext';
import { UserProduct } from '@/types/products';

interface SwipeableProductCardProps {
  userProduct: UserProduct;
  onPress?: () => void;
  showLastUsed?: boolean;
  onDeleteSuccess?: () => void;
}

export function SwipeableProductCard({
  onDeleteSuccess,
  ...cardProps
}: SwipeableProductCardProps) {
  const { deleteProduct, isDeletingProduct } = useProducts();

  const handleDelete = useCallback(async () => {
    if (isDeletingProduct) return;

    const { confirmed } = await showConfirmationDialog({
      title: '删除产品',
      message: '确定要删除这个产品吗？此操作无法撤销。',
    });

    if (confirmed) {
      try {
        await deleteProduct(cardProps.userProduct.id);
        onDeleteSuccess?.();
      } catch (error) {
        // 错误已经在 Context 中处理
      }
    }
  }, [cardProps.userProduct.id, deleteProduct, isDeletingProduct, onDeleteSuccess]);

  const rightActions: SwipeAction[] = [
    {
      text: '删除',
      backgroundColor: colors.danger,
      onPress: handleDelete,
    },
  ];

  return (
    <SwipeableRow rightActions={rightActions}>
      <ProductCard {...cardProps} />
    </SwipeableRow>
  );
} 