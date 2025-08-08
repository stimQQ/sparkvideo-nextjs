import { apiClient } from '@/app/lib/api-client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}

export interface GoogleLoginData {
  credential: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', data);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', data);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    return response;
  }

  async googleLogin(data: GoogleLoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/google', data);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/v1/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/v1/auth/me');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/v1/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/v1/auth/forgot-password', { email });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();