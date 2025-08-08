import { apiClient } from '@/app/lib/api-client';

export interface AudioTask {
  id: string;
  user_id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  input_file_url?: string;
  output_file_url?: string;
  transcription?: string;
  error_message?: string;
  progress?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AudioUploadResponse {
  upload_url: string;
  file_url: string;
  task_id?: string;
}

export interface TranscribeOptions {
  language?: string;
  auto_detect?: boolean;
}

export interface TranslateOptions {
  source_language?: string;
  target_language: string;
  preserve_voice?: boolean;
}

export interface AudioConvertOptions {
  target_format: string;
  bitrate?: string;
  sample_rate?: number;
}

class AudioService {
  async uploadAudio(file: File, onProgress?: (progress: number) => void): Promise<AudioUploadResponse> {
    const { upload_url, file_url } = await apiClient.post<AudioUploadResponse>('/v1/audio/upload', {
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

  async transcribeAudio(fileUrl: string, options: TranscribeOptions = {}): Promise<AudioTask> {
    return apiClient.post<AudioTask>('/v1/audio/transcribe', {
      file_url: fileUrl,
      ...options,
    });
  }

  async translateAudio(fileUrl: string, options: TranslateOptions): Promise<AudioTask> {
    return apiClient.post<AudioTask>('/v1/audio/translate', {
      file_url: fileUrl,
      ...options,
    });
  }

  async convertAudio(fileUrl: string, options: AudioConvertOptions): Promise<AudioTask> {
    return apiClient.post<AudioTask>('/v1/audio/convert', {
      file_url: fileUrl,
      ...options,
    });
  }

  async getTasks(page = 1, limit = 20): Promise<{ tasks: AudioTask[]; total: number }> {
    return apiClient.get('/v1/audio/tasks', {
      params: { page, limit },
    });
  }

  async getTask(taskId: string): Promise<AudioTask> {
    return apiClient.get<AudioTask>(`/v1/audio/tasks/${taskId}`);
  }

  async getTranscription(taskId: string): Promise<{ transcription: string }> {
    return apiClient.get(`/v1/audio/tasks/${taskId}/transcription`);
  }

  async cancelTask(taskId: string): Promise<void> {
    await apiClient.delete(`/v1/audio/tasks/${taskId}`);
  }
}

export const audioService = new AudioService();