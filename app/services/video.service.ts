import { apiClient } from '@/app/lib/api-client';

export interface VideoTask {
  id: string;
  user_id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  input_file_url?: string;
  output_file_url?: string;
  error_message?: string;
  progress?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VideoUploadResponse {
  upload_url: string;
  file_url: string;
  task_id?: string;
}

export interface VideoCompressOptions {
  quality?: 'high' | 'medium' | 'low';
  target_size?: number;
  video_codec?: string;
  audio_codec?: string;
}

export interface VideoConvertOptions {
  target_format: string;
  video_codec?: string;
  audio_codec?: string;
  resolution?: string;
  fps?: number;
  bitrate?: string;
}

export interface VideoCropOptions {
  aspect_ratio?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface VideoMergeOptions {
  video_urls: string[];
  transition?: 'none' | 'fade' | 'slide';
  output_format?: string;
}

export interface VideoSplitOptions {
  segments?: Array<{ start: number; end: number }>;
  chunk_duration?: number;
  max_size?: number;
}

export interface VideoEnhanceOptions {
  type: 'denoise' | 'deblur' | 'remove-watermark' | 'remove-logo' | 'remove-subtitle' | 'remove-background' | 'enhance';
  intensity?: 'low' | 'medium' | 'high';
}

export interface VideoParseResponse {
  title: string;
  duration: number;
  thumbnail: string;
  formats: Array<{
    quality: string;
    format: string;
    size?: number;
    url: string;
  }>;
}

class VideoService {
  async uploadVideo(file: File, onProgress?: (progress: number) => void): Promise<VideoUploadResponse> {
    const { upload_url, file_url } = await apiClient.post<VideoUploadResponse>('/v1/videos/upload', {
      filename: file.name,
      content_type: file.type,
      size: file.size,
    });

    await fetch(upload_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return { upload_url, file_url };
  }

  async compressVideo(fileUrl: string, options: VideoCompressOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>('/v1/videos/compress', {
      file_url: fileUrl,
      ...options,
    });
  }

  async convertVideo(fileUrl: string, options: VideoConvertOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>('/v1/videos/convert', {
      file_url: fileUrl,
      ...options,
    });
  }

  async cropVideo(fileUrl: string, options: VideoCropOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>('/v1/videos/crop', {
      file_url: fileUrl,
      ...options,
    });
  }

  async mergeVideos(options: VideoMergeOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>('/v1/videos/merge', options);
  }

  async splitVideo(fileUrl: string, options: VideoSplitOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>('/v1/videos/split', {
      file_url: fileUrl,
      ...options,
    });
  }

  async enhanceVideo(fileUrl: string, options: VideoEnhanceOptions): Promise<VideoTask> {
    return apiClient.post<VideoTask>(`/v1/videos/enhance/${options.type}`, {
      file_url: fileUrl,
      intensity: options.intensity,
    });
  }

  async parseVideoUrl(url: string): Promise<VideoParseResponse> {
    return apiClient.post<VideoParseResponse>('/v1/videos/parse', { url });
  }

  async getTasks(page = 1, limit = 20): Promise<{ tasks: VideoTask[]; total: number }> {
    return apiClient.get('/v1/videos/tasks', {
      params: { page, limit },
    });
  }

  async getTask(taskId: string): Promise<VideoTask> {
    return apiClient.get<VideoTask>(`/v1/videos/tasks/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<void> {
    await apiClient.delete(`/v1/videos/tasks/${taskId}`);
  }

  async retryTask(taskId: string): Promise<VideoTask> {
    return apiClient.post<VideoTask>(`/v1/videos/tasks/${taskId}/retry`);
  }
}

export const videoService = new VideoService();