'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';

export default function PricingSection() {
  const t = useTranslations();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      key: 'free',
      popular: false,
      price: 0,
      priceYearly: 0,
    },
    {
      key: 'premium',
      popular: true,
      price: 99,
      priceYearly: 990,
    },
    {
      key: 'enterprise',
      popular: false,
      price: null,
      priceYearly: null,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">{t('pricing.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('pricing.subtitle')}</p>
          
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className={cn('text-sm', !isYearly && 'font-semibold')}>{t('pricing.monthly')}</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-primary transition-transform',
                isYearly ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
            <span className={cn('text-sm', isYearly && 'font-semibold')}>
              {t('pricing.yearly')} 
              <span className="text-primary ml-1">({t('pricing.save')} 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                'relative rounded-2xl border p-8',
                plan.popular ? 'border-primary shadow-xl' : 'border-border'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    {t('pricing.popular')}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold">{t(`pricing.plans.${plan.key}.name`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`pricing.plans.${plan.key}.description`)}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">
                    {plan.price === null 
                      ? t(`pricing.plans.${plan.key}.price`)
                      : isYearly 
                        ? t(`pricing.plans.${plan.key}.priceYearly`)
                        : t(`pricing.plans.${plan.key}.price`)
                    }
                  </span>
                  {plan.price !== null && (
                    <span className="text-muted-foreground">
                      /{isYearly ? t('pricing.yearly').toLowerCase() : t('pricing.monthly').toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => {
                  const featureKey = `pricing.plans.${plan.key}.features`;
                  const feature = t(`${featureKey}.${i - 1}` as any);
                  if (!feature || feature === featureKey) return null;
                  return (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3 text-sm">{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <Link
                href={plan.key === 'enterprise' ? '/contact' : '/register'}
                className={cn(
                  'block w-full text-center rounded-md px-4 py-2 text-sm font-medium',
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {plan.key === 'enterprise' ? t('pricing.contact') : t('hero.cta.getStarted')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}