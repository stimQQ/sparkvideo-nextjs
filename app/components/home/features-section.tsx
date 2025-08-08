'use client';

import { useTranslations } from 'next-intl';

export default function FeaturesSection() {
  const t = useTranslations();

  const features = {
    video: [
      { key: 'compress', icon: '📦' },
      { key: 'convert', icon: '🔄' },
      { key: 'crop', icon: '✂️' },
      { key: 'merge', icon: '🔗' },
      { key: 'split', icon: '✂️' },
      { key: 'enhance', icon: '✨' },
    ],
    audio: [
      { key: 'transcribe', icon: '📝' },
      { key: 'translate', icon: '🌍' },
      { key: 'convert', icon: '🔄' },
      { key: 'enhance', icon: '🎵' },
    ],
    ai: [
      { key: 'denoise', icon: '🔇' },
      { key: 'deblur', icon: '👓' },
      { key: 'removeWatermark', icon: '💧' },
      { key: 'removeBackground', icon: '🖼️' },
      { key: 'subtitle', icon: '📺' },
    ],
  };

  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">{t('features.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('features.subtitle')}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">{t('features.video.title')}</h3>
            <div className="space-y-4">
              {features.video.map((feature) => (
                <div key={feature.key} className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium">{t(`features.video.${feature.key}`)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t(`features.video.${feature.key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">{t('features.audio.title')}</h3>
            <div className="space-y-4">
              {features.audio.map((feature) => (
                <div key={feature.key} className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium">{t(`features.audio.${feature.key}`)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t(`features.audio.${feature.key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">{t('features.ai.title')}</h3>
            <div className="space-y-4">
              {features.ai.map((feature) => (
                <div key={feature.key} className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium">{t(`features.ai.${feature.key}`)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t(`features.ai.${feature.key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}