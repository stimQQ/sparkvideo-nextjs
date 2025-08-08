'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { subscriptionService, SubscriptionPlan, UserSubscription } from '@/app/services/subscription.service';
import { useAuthStore } from '@/app/store/auth.store';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

export default function PricingPage() {
  const t = useTranslations();
  const { isAuthenticated } = useAuthStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState('USD');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free',
        tier: 'FREE',
        price_monthly: 0,
        price_yearly: 0,
        features: [
          '5 videos per day',
          '100MB max file size',
          'Basic format conversion',
          '720p output quality',
          'Community support'
        ],
        limits: {
          daily_videos: 5,
          max_file_size: 104857600, // 100MB
          storage_gb: 1,
          concurrent_tasks: 1,
          api_calls_per_day: 100
        }
      },
      {
        id: 'premium',
        name: 'Premium',
        tier: 'PREMIUM',
        price_monthly: 14.99,
        price_yearly: 149.90,
        features: [
          '100 videos per day',
          '2GB max file size',
          'All format conversions',
          '4K output quality',
          'AI enhancement features',
          'Batch processing',
          'Priority support',
          'Watermark removal'
        ],
        limits: {
          daily_videos: 100,
          max_file_size: 2147483648, // 2GB
          storage_gb: 50,
          concurrent_tasks: 5,
          api_calls_per_day: 10000
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'ENTERPRISE',
        price_monthly: 99.99,
        price_yearly: 999.90,
        features: [
          'Unlimited video processing',
          '5GB max file size',
          'All premium features',
          '8K output quality',
          'API access',
          'Dedicated account manager',
          'Custom features',
          'SLA guarantee',
          'Priority processing queue'
        ],
        limits: {
          daily_videos: -1, // Unlimited
          max_file_size: 5368709120, // 5GB
          storage_gb: 500,
          concurrent_tasks: 20,
          api_calls_per_day: 100000
        }
      }
    ];

    const mockCurrentSubscription: UserSubscription | null = isAuthenticated ? {
      id: 'sub_123',
      user_id: 'user_123',
      plan_id: 'free',
      plan: mockPlans[0],
      status: 'active',
      current_period_start: '2024-01-01T00:00:00Z',
      current_period_end: '2024-02-01T00:00:00Z',
      cancel_at_period_end: false
    } : null;

    setTimeout(() => {
      setPlans(mockPlans);
      setCurrentSubscription(mockCurrentSubscription);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated]);

  const handleUpgrade = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setUpgrading(planId);
      // In real app, this would call the actual API
      const { payment_url } = await subscriptionService.upgradePlan(planId);
      window.location.href = payment_url;
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const formatPrice = (monthly: number, yearly: number) => {
    const price = billingCycle === 'monthly' ? monthly : yearly;
    if (price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    
    return formatter.format(price);
  };

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0 || yearly === 0) return 0;
    const monthlyCost = monthly * 12;
    return Math.round(((monthlyCost - yearly) / monthlyCost) * 100);
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId;
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      return plan.tier === 'FREE' ? 'Get Started' : 'Sign Up';
    }
    
    if (isCurrentPlan(plan.id)) {
      return t('pricing.currentPlan');
    }
    
    if (plan.tier === 'FREE') {
      return t('pricing.downgrade');
    }
    
    if (plan.tier === 'ENTERPRISE') {
      return t('pricing.contact');
    }
    
    return t('pricing.upgrade');
  };

  const getButtonAction = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      return plan.tier === 'FREE' ? '/register' : '/register';
    }
    
    if (isCurrentPlan(plan.id)) {
      return null; // Disabled
    }
    
    if (plan.tier === 'ENTERPRISE') {
      return 'mailto:sales@sparkvideo.com'; // Contact sales
    }
    
    return () => handleUpgrade(plan.id);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem-20rem)]">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse text-center mb-12">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-8">
                  <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                  <div className="h-12 bg-muted rounded w-32 mb-6"></div>
                  <div className="space-y-2 mb-8">
                    {[1, 2, 3, 4, 5].map(j => (
                      <div key={j} className="h-4 bg-muted rounded"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem-20rem)]">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('pricing.subtitle')}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('pricing.monthly')}
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('pricing.yearly')}
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Save up to 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = plan.tier === 'PREMIUM';
              const savings = getYearlySavings(plan.price_monthly, plan.price_yearly);
              const buttonAction = getButtonAction(plan);
              const isCurrentUserPlan = isCurrentPlan(plan.id);
              
              return (
                <div
                  key={plan.id}
                  className={`card p-8 relative ${
                    isPopular ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        {t('pricing.popular')}
                      </span>
                    </div>
                  )}

                  {isCurrentUserPlan && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <div className="text-4xl font-bold">
                        {formatPrice(plan.price_monthly, plan.price_yearly)}
                        {plan.price_monthly > 0 && (
                          <span className="text-lg font-normal text-muted-foreground">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && savings > 0 && (
                        <div className="text-green-600 text-sm font-medium mt-1">
                          {t('pricing.save')} {savings}%
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {t(`pricing.plans.${plan.tier.toLowerCase()}.description`)}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {typeof buttonAction === 'function' ? (
                    <button
                      onClick={buttonAction}
                      disabled={isCurrentUserPlan || upgrading === plan.id}
                      className={`w-full transition-all ${
                        isCurrentUserPlan
                          ? 'btn-ghost cursor-not-allowed'
                          : isPopular
                          ? 'btn-primary'
                          : 'btn-ghost'
                      }`}
                    >
                      {upgrading === plan.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        getButtonText(plan)
                      )}
                    </button>
                  ) : typeof buttonAction === 'string' ? (
                    <a
                      href={buttonAction}
                      className={`block w-full text-center transition-all ${
                        isPopular ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      {getButtonText(plan)}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full btn-ghost cursor-not-allowed"
                    >
                      {getButtonText(plan)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Can I change my plan at any time?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your current billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Our Free plan allows you to try our services with limited usage. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens to my files if I cancel?</h3>
                <p className="text-muted-foreground text-sm">
                  Your files remain accessible for 30 days after cancellation. You can download them during this period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer volume discounts?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we offer custom pricing for teams and organizations with high-volume needs. Contact our sales team.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of content creators who trust SparkVideo
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/register" className="btn-primary">
                Start Free Trial
              </a>
              <a href="/contact" className="btn-ghost">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}