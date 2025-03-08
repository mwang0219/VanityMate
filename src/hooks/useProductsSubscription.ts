import { useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Product } from '../lib/supabase/types';

type SubscriptionCallback = (payload: {
  new: Product | null;
  old: Product | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;

export function useProductsSubscription(
  userId: string,
  callback: SubscriptionCallback
) {
  useEffect(() => {
    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback({
            new: payload.new as Product,
            old: payload.old as Product,
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, callback]);
} 