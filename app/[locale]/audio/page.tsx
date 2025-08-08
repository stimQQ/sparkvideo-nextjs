'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { audioService } from '@/app/services/audio.service';
import { formatBytes } from '@/app/lib/utils';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

export default function AudioPage() {
  const t = useTranslations();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingType, setProcessingType] = useState('transcribe');
  const [processOptions, setProcessOptions] = useState<any>({});
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [transcription, setTranscription] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      setTranscription('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await audioService.uploadAudio(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Process audio based on selected type
      let task;
      switch (processingType) {
        case 'transcribe':
          task = await audioService.transcribeAudio(response.file_url, {
            language: processOptions.language,
            auto_detect: processOptions.language === 'auto',
          });
          break;
        case 'translate':
          task = await audioService.translateAudio(response.file_url, {
            target_language: processOptions.targetLanguage || 'en',
            preserve_voice: processOptions.preserveVoice || false,
          });
          break;
        case 'convert':
          task = await audioService.convertAudio(response.file_url, {
            target_format: processOptions.format || 'mp3',
            bitrate: processOptions.bitrate,
          });
          break;
        default:
          break;
      }
      
      setCurrentTask(task);
      
      // Poll for transcription if it's a transcribe task
      if (processingType === 'transcribe' && task) {
        pollForTranscription(task.id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const pollForTranscription = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const task = await audioService.getTask(taskId);
        setCurrentTask(task);
        
        if (task.status === 'completed') {
          const { transcription } = await audioService.getTranscription(taskId);
          setTranscription(transcription);
          clearInterval(interval);
        } else if (task.status === 'failed' || task.status === 'cancelled') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to fetch task status:', error);
        clearInterval(interval);
      }
    }, 2000);
  };

  const processingTypes = [
    { value: 'transcribe', label: t('audio.transcribe.title') },
    { value: 'translate', label: t('audio.translate.title') },
    { value: 'convert', label: t('features.audio.convert') },
  ];

  const languages = [
    { value: 'auto', label: t('audio.transcribe.autoDetect') },
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem-20rem)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">{t('nav.audio')}</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">{t('audio.upload.title')}</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
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
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('common.dragDropFile')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('audio.upload.supportedFormats')}
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
                          {uploadProgress}% {t('audio.upload.uploading')}
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
                {processingType === 'transcribe' && (
                  <div>
                    <label className="label">{t('audio.transcribe.language')}</label>
                    <select
                      className="select w-full"
                      value={processOptions.language || 'auto'}
                      onChange={(e) => setProcessOptions({ ...processOptions, language: e.target.value })}
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {processingType === 'translate' && (
                  <>
                    <div>
                      <label className="label">{t('audio.translate.targetLanguage')}</label>
                      <select
                        className="select w-full"
                        value={processOptions.targetLanguage || 'en'}
                        onChange={(e) => setProcessOptions({ ...processOptions, targetLanguage: e.target.value })}
                      >
                        {languages.filter(l => l.value !== 'auto').map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preserve-voice"
                        className="checkbox"
                        checked={processOptions.preserveVoice || false}
                        onChange={(e) => setProcessOptions({ ...processOptions, preserveVoice: e.target.checked })}
                      />
                      <label htmlFor="preserve-voice" className="ml-2 text-sm">
                        {t('audio.translate.preserveVoice')}
                      </label>
                    </div>
                  </>
                )}

                {processingType === 'convert' && (
                  <div>
                    <label className="label">{t('video.process.convert.targetFormat')}</label>
                    <select
                      className="select w-full"
                      value={processOptions.format || 'mp3'}
                      onChange={(e) => setProcessOptions({ ...processOptions, format: e.target.value })}
                    >
                      <option value="mp3">MP3</option>
                      <option value="wav">WAV</option>
                      <option value="aac">AAC</option>
                      <option value="flac">FLAC</option>
                      <option value="ogg">OGG</option>
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

          {/* Results Section */}
          {currentTask && (
            <div className="mt-8 card p-6">
              <h3 className="text-xl font-semibold mb-4">{t('dashboard.tasks.title')}</h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
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
                
                {/* Transcription Result */}
                {transcription && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('audio.transcribe.result')}</h4>
                    <div className="bg-background rounded-lg p-4 max-h-64 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{transcription}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(transcription)}
                        className="btn-secondary"
                      >
                        {t('common.copy')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}