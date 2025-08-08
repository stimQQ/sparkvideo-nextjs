'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/app/store/auth.store';
import { formatBytes } from '@/app/lib/utils';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

interface Task {
  id: string;
  type: 'video_compression' | 'video_conversion' | 'video_crop' | 'audio_transcription' | 'audio_translation';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  filename: string;
  created_at: string;
  completed_at?: string;
  progress?: number;
  output_file_url?: string;
  error_message?: string;
}

interface UsageStats {
  videos_processed_today: number;
  storage_used_gb: number;
  processing_time_minutes: number;
  space_saved_gb: number;
  daily_limit: number;
  storage_limit_gb: number;
}

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Mock data - in real app, this would come from APIs
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 'task_001',
        type: 'video_compression',
        status: 'completed',
        filename: 'presentation-recording.mp4',
        created_at: '2024-01-15T14:30:00Z',
        completed_at: '2024-01-15T14:35:00Z',
        output_file_url: 'https://example.com/compressed/presentation-recording.mp4',
      },
      {
        id: 'task_002',
        type: 'audio_transcription',
        status: 'processing',
        filename: 'interview-audio.wav',
        created_at: '2024-01-15T15:20:00Z',
        progress: 67,
      },
      {
        id: 'task_003',
        type: 'video_conversion',
        status: 'completed',
        filename: 'demo-video.avi',
        created_at: '2024-01-15T13:15:00Z',
        completed_at: '2024-01-15T13:22:00Z',
        output_file_url: 'https://example.com/converted/demo-video.mp4',
      },
      {
        id: 'task_004',
        type: 'video_crop',
        status: 'failed',
        filename: 'raw-footage.mov',
        created_at: '2024-01-15T12:00:00Z',
        error_message: 'Invalid aspect ratio parameters',
      },
      {
        id: 'task_005',
        type: 'audio_translation',
        status: 'pending',
        filename: 'spanish-audio.mp3',
        created_at: '2024-01-15T16:00:00Z',
      },
    ];

    const mockStats: UsageStats = {
      videos_processed_today: 8,
      storage_used_gb: 2.4,
      processing_time_minutes: 45,
      space_saved_gb: 1.2,
      daily_limit: 100,
      storage_limit_gb: 5,
    };

    setTimeout(() => {
      setTasks(mockTasks);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTaskTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'video_compression':
        return 'Video Compression';
      case 'video_conversion':
        return 'Video Conversion';
      case 'video_crop':
        return 'Video Crop';
      case 'audio_transcription':
        return 'Audio Transcription';
      case 'audio_translation':
        return 'Audio Translation';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRetryTask = async (taskId: string) => {
    // In real app, this would call the API to retry the task
    console.log('Retrying task:', taskId);
  };

  const handleCancelTask = async (taskId: string) => {
    // In real app, this would call the API to cancel the task
    if (confirm('Are you sure you want to cancel this task?')) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: 'cancelled' as const } : task
        )
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem-20rem)]">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-2"></div>
              <div className="h-4 bg-muted rounded w-48 mb-8"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card p-6">
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                ))}
              </div>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {user?.name 
                ? t('dashboard.welcome', { name: user.name })
                : 'Welcome to your dashboard'
              }
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.stats.videosProcessed')}
                  </h3>
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">{stats.videos_processed_today}</p>
                <p className="text-sm text-muted-foreground">
                  of {stats.daily_limit} daily limit
                </p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(stats.videos_processed_today / stats.daily_limit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.stats.storageUsed')}
                  </h3>
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">{stats.storage_used_gb.toFixed(1)} GB</p>
                <p className="text-sm text-muted-foreground">
                  of {stats.storage_limit_gb} GB limit
                </p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(stats.storage_used_gb / stats.storage_limit_gb) * 100}%` }}
                  />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.stats.processingTime')}
                  </h3>
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">{stats.processing_time_minutes}</p>
                <p className="text-sm text-muted-foreground">minutes saved</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.stats.savedSpace')}
                  </h3>
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">{stats.space_saved_gb.toFixed(1)} GB</p>
                <p className="text-sm text-muted-foreground">space saved</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Tasks */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{t('dashboard.tasks.title')}</h2>
                  <select
                    className="select"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-muted-foreground">{t('dashboard.tasks.empty')}</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {t(`common.status.${task.status}`)}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {getTaskTypeLabel(task.type)}
                            </span>
                          </div>
                          <p className="font-medium truncate">{task.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatDate(task.created_at)}
                            {task.completed_at && (
                              <span> • Completed: {formatDate(task.completed_at)}</span>
                            )}
                          </p>
                          {task.progress !== undefined && task.status === 'processing' && (
                            <div className="w-full bg-secondary rounded-full h-2 mt-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                          {task.error_message && (
                            <p className="text-sm text-red-600 mt-1">{task.error_message}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {task.status === 'completed' && task.output_file_url && (
                            <a
                              href={task.output_file_url}
                              download
                              className="btn-ghost p-2"
                              title="Download result"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </a>
                          )}
                          {task.status === 'failed' && (
                            <button
                              onClick={() => handleRetryTask(task.id)}
                              className="btn-ghost p-2 text-primary"
                              title="Retry task"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                          {(task.status === 'pending' || task.status === 'processing') && (
                            <button
                              onClick={() => handleCancelTask(task.id)}
                              className="btn-ghost p-2 text-destructive"
                              title="Cancel task"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">{t('dashboard.quickActions')}</h2>
                <div className="space-y-3">
                  <a
                    href="/video"
                    className="block w-full btn-primary text-center"
                  >
                    <svg className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Process Video
                  </a>
                  <a
                    href="/audio"
                    className="block w-full btn-ghost text-center"
                  >
                    <svg className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Process Audio
                  </a>
                  <a
                    href="/documents"
                    className="block w-full btn-ghost text-center"
                  >
                    <svg className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Documents
                  </a>
                  <a
                    href="/pricing"
                    className="block w-full btn-ghost text-center"
                  >
                    <svg className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    View Pricing
                  </a>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card p-6 mt-6">
                <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Video compression completed</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Audio transcription started</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Document created from transcription</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}