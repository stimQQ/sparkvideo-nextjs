import { apiClient } from '@/app/lib/api-client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    daily_videos: number;
    max_file_size: number;
    storage_gb: number;
    concurrent_tasks: number;
    api_calls_per_day: number;
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface UsageStats {
  videos_processed_today: number;
  storage_used_gb: number;
  api_calls_today: number;
  limits: {
    daily_videos: number;
    max_file_size: number;
    storage_gb: number;
    api_calls_per_day: number;
  };
  reset_at: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  created_at: string;
}

class SubscriptionService {
  async getPlans(): Promise<SubscriptionPlan[]> {
    return apiClient.get<SubscriptionPlan[]>('/v1/subscription/plans');
  }

  async getCurrentSubscription(): Promise<UserSubscription> {
    return apiClient.get<UserSubscription>('/v1/subscription/my-plan');
  }

  async getUsageStats(): Promise<UsageStats> {
    return apiClient.get<UsageStats>('/v1/subscription/usage');
  }

  async upgradePlan(planId: string): Promise<{ payment_url: string }> {
    return apiClient.post('/v1/subscription/upgrade', { plan_id: planId });
  }

  async cancelSubscription(): Promise<void> {
    await apiClient.post('/v1/subscription/cancel');
  }

  async getPaymentHistory(page = 1, limit = 20): Promise<{ payments: PaymentHistory[]; total: number }> {
    return apiClient.get('/v1/payment/history', {
      params: { page, limit },
    });
  }
}

export const subscriptionService = new SubscriptionService();