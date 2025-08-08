'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { videoService } from '@/app/services/video.service';
import { formatBytes } from '@/app/lib/utils';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

export default function VideoPage() {
  const t = useTranslations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingType, setProcessingType] = useState('compress');
  const [processOptions, setProcessOptions] = useState<any>({});
  const [currentTask, setCurrentTask] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await videoService.uploadVideo(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Process video based on selected type
      let task;
      switch (processingType) {
        case 'compress':
          task = await videoService.compressVideo(response.file_url, {
            quality: processOptions.quality || 'medium',
          });
          break;
        case 'convert':
          task = await videoService.convertVideo(response.file_url, {
            target_format: processOptions.format || 'mp4',
          });
          break;
        case 'crop':
          task = await videoService.cropVideo(response.file_url, {
            aspect_ratio: processOptions.aspectRatio || '16:9',
          });
          break;
        default:
          break;
      }
      
      setCurrentTask(task);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const processingTypes = [
    { value: 'compress', label: t('video.process.compress.title') },
    { value: 'convert', label: t('video.process.convert.title') },
    { value: 'crop', label: t('video.process.crop.title') },
    { value: 'enhance', label: t('video.process.enhance.title') },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem-20rem)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">{t('nav.video')}</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">{t('video.upload.title')}</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('common.dragDropFile')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('video.upload.supportedFormats')}
                    </p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBytes(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {uploadProgress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {uploadProgress}% {t('video.upload.uploading')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Processing Options */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">{t('video.process.title')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">{t('video.process.selectOperation')}</label>
                  <select
                    className="select w-full"
                    value={processingType}
                    onChange={(e) => setProcessingType(e.target.value)}
                  >
                    {processingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic options based on processing type */}
                {processingType === 'compress' && (
                  <div>
                    <label className="label">{t('video.process.compress.quality')}</label>
                    <select
                      className="select w-full"
                      value={processOptions.quality || 'medium'}
                      onChange={(e) => setProcessOptions({ ...processOptions, quality: e.target.value })}
                    >
                      <option value="high">{t('video.process.compress.preset.high')}</option>
                      <option value="medium">{t('video.process.compress.preset.medium')}</option>
                      <option value="low">{t('video.process.compress.preset.low')}</option>
                    </select>
                  </div>
                )}

                {processingType === 'convert' && (
                  <div>
                    <label className="label">{t('video.process.convert.targetFormat')}</label>
                    <select
                      className="select w-full"
                      value={processOptions.format || 'mp4'}
                      onChange={(e) => setProcessOptions({ ...processOptions, format: e.target.value })}
                    >
                      <option value="mp4">MP4</option>
                      <option value="webm">WebM</option>
                      <option value="avi">AVI</option>
                      <option value="mov">MOV</option>
                    </select>
                  </div>
                )}

                {processingType === 'crop' && (
                  <div>
                    <label className="label">{t('video.process.crop.aspectRatio')}</label>
                    <select
                      className="select w-full"
                      value={processOptions.aspectRatio || '16:9'}
                      onChange={(e) => setProcessOptions({ ...processOptions, aspectRatio: e.target.value })}
                    >
                      <option value="16:9">{t('video.process.crop.presets.16:9')}</option>
                      <option value="4:3">{t('video.process.crop.presets.4:3')}</option>
                      <option value="1:1">{t('video.process.crop.presets.1:1')}</option>
                      <option value="9:16">{t('video.process.crop.presets.9:16')}</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? t('common.processing') : t('common.process')}
                </button>
              </div>
            </div>
          </div>

          {/* Task Status */}
          {currentTask && (
            <div className="mt-8 card p-6">
              <h3 className="text-xl font-semibold mb-4">{t('dashboard.tasks.title')}</h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task ID: {currentTask.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {t(`common.status.${currentTask.status}`)}
                    </p>
                  </div>
                  {currentTask.status === 'completed' && currentTask.output_file_url && (
                    <a
                      href={currentTask.output_file_url}
                      download
                      className="btn-primary"
                    >
                      {t('common.download')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}