'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api/client'
import { formatDuration, formatFileSize } from '@/lib/utils'
import { Transcript, TranscriptSegment } from '@/types/models'
import { cn } from '@/lib/utils'

export default function AudioTranscribePage() {
  const [inputMethod, setInputMethod] = useState<'upload' | 'record' | 'url'>('upload')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 转写设置
  const [settings, setSettings] = useState({
    language: 'auto',
    speakerDetection: true,
    punctuation: true,
    format: 'txt' as 'txt' | 'srt' | 'docx',
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setError('文件大小不能超过500MB')
        return
      }
      setAudioFile(file)
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file)
      setError(null)
    }
  }

  const handleTranscribe = async () => {
    setError(null)
    setIsProcessing(true)
    setProgress(0)

    try {
      // 模拟上传和处理进度
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // 调用API
      let audioUrlToProcess = audioUrl
      
      if (audioFile) {
        // 如果是文件，先上传
        const uploadResult = await api.audio.upload(audioFile)
        audioUrlToProcess = uploadResult.url
      }

      const result = await api.audio.transcribe(audioUrlToProcess, settings.language)
      
      clearInterval(interval)
      setProgress(100)
      setTranscript(result)
    } catch (err: any) {
      setError(err.message || '转写失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = (format: string) => {
    if (!transcript) return
    
    // 根据格式导出
    const content = transcript.segments
      .map(s => `[${formatDuration(s.start)}] ${s.speaker ? `${s.speaker}: ` : ''}${s.text}`)
      .join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript.${format}`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            音频转文字 - Audio Transcription
          </h1>
          <p className="text-gray-600">
            AI精准转写，支持100+语言，准确率高达99%
          </p>
        </div>

        {/* Input Method Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2 mb-6">
            {[
              { value: 'upload', label: '上传音频文件', icon: '📁' },
              { value: 'record', label: '录制音频', icon: '🎙️' },
              { value: 'url', label: 'YouTube链接', icon: '🔗' },
            ].map((method) => (
              <button
                key={method.value}
                onClick={() => setInputMethod(method.value as any)}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
                  inputMethod === method.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <span className="mr-2">{method.icon}</span>
                {method.label}
              </button>
            ))}
          </div>

          {/* Upload Area */}
          {inputMethod === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
            >
              {audioFile ? (
                <div className="space-y-2">
                  <div className="text-4xl">🎵</div>
                  <p className="font-medium text-gray-900">{audioFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(audioFile.size)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioFile(null)}
                  >
                    更换文件
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-4">🎵</div>
                  <p className="text-gray-600 mb-4">拖拽音频文件到此处</p>
                  <p className="text-gray-500 mb-4">或者</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    选择音频文件
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    支持格式: MP3, WAV, M4A, FLAC, OGG, AAC | 最大文件: 500MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* URL Input */}
          {inputMethod === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube视频链接
              </label>
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">转写设置</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                语言设置
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="auto">自动检测</option>
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                说话人识别
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.speakerDetection}
                    onChange={(e) => setSettings({ ...settings, speakerDetection: e.target.checked })}
                    className="mr-2"
                  />
                  识别说话人
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标点符号
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.punctuation}
                    onChange={(e) => setSettings({ ...settings, punctuation: e.target.checked })}
                    className="mr-2"
                  />
                  智能标点
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                输出格式
              </label>
              <div className="space-y-2">
                {[
                  { value: 'txt', label: '纯文本' },
                  { value: 'srt', label: '带时间戳' },
                  { value: 'docx', label: 'Word文档' },
                ].map((format) => (
                  <label key={format.value} className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={settings.format === format.value}
                      onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
                      className="mr-2"
                    />
                    {format.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleTranscribe}
              loading={isProcessing}
              disabled={!audioFile && !audioUrl}
              fullWidth
            >
              开始转写文字
            </Button>
          </div>
        </div>

        {/* Processing Display */}
        {isProcessing && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">转写进度</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                正在使用AI进行精准转写，请稍候...
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {transcript && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">转写结果</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport('txt')}>
                  下载TXT
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('srt')}>
                  下载SRT
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('docx')}>
                  下载DOCX
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              {transcript.segments.map((segment, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-500 font-mono">
                      [{formatDuration(segment.start)}]
                    </span>
                    <div className="flex-1">
                      {segment.speaker && (
                        <span className="text-sm font-medium text-indigo-600 mr-2">
                          {segment.speaker}:
                        </span>
                      )}
                      <span className="text-gray-900">{segment.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}