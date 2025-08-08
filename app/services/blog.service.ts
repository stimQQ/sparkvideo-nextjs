import { apiClient } from '@/app/lib/api-client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes?: number;
  language: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  status?: string;
  language?: string;
  author?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'popular' | 'updated';
}

export interface BlogStats {
  total_posts: number;
  total_views: number;
  total_likes: number;
  posts_by_status: {
    draft: number;
    published: number;
    archived: number;
  };
  popular_posts: BlogPost[];
}

class BlogService {
  // Public endpoints
  async getPublicPosts(filters: BlogFilters = {}): Promise<{ posts: BlogPost[]; total: number }> {
    return apiClient.get('/v1/blog', { params: filters });
  }

  async getPublicPost(slug: string): Promise<BlogPost> {
    return apiClient.get(`/v1/blog/slug/${slug}`);
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return apiClient.get('/v1/blog/search', { params: { q: query } });
  }

  async getPopularPosts(limit = 5): Promise<BlogPost[]> {
    return apiClient.get('/v1/blog/popular', { params: { limit } });
  }

  async getRelatedPosts(postId: string, limit = 4): Promise<BlogPost[]> {
    return apiClient.get(`/v1/blog/related/${postId}`, { params: { limit } });
  }

  // Admin endpoints
  async getAllPosts(filters: BlogFilters = {}): Promise<{ posts: BlogPost[]; total: number }> {
    return apiClient.get('/api/admin/blog/posts', { params: filters });
  }

  async getPost(id: string): Promise<BlogPost> {
    return apiClient.get(`/api/admin/blog/posts/${id}`);
  }

  async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.post('/api/admin/blog/posts', data);
  }

  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.put(`/api/admin/blog/posts/${id}`, data);
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/blog/posts/${id}`);
  }

  async publishPost(id: string): Promise<BlogPost> {
    return apiClient.post(`/api/admin/blog/posts/${id}/publish`);
  }

  async unpublishPost(id: string): Promise<BlogPost> {
    return apiClient.post(`/api/admin/blog/posts/${id}/unpublish`);
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/api/admin/blog/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  // Categories
  async getCategories(): Promise<BlogCategory[]> {
    return apiClient.get('/api/admin/blog/categories');
  }

  async createCategory(data: Partial<BlogCategory>): Promise<BlogCategory> {
    return apiClient.post('/api/admin/blog/categories', data);
  }

  async updateCategory(id: string, data: Partial<BlogCategory>): Promise<BlogCategory> {
    return apiClient.put(`/api/admin/blog/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/blog/categories/${id}`);
  }

  // Tags
  async getTags(): Promise<BlogTag[]> {
    return apiClient.get('/api/admin/blog/tags');
  }

  async createTag(name: string): Promise<BlogTag> {
    return apiClient.post('/api/admin/blog/tags', { name });
  }

  async deleteTag(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/blog/tags/${id}`);
  }

  // Statistics
  async getStats(): Promise<BlogStats> {
    return apiClient.get('/api/admin/blog/stats');
  }

  // Utility functions
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // Keep alphanumeric, spaces, Chinese characters and hyphens
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  formatExcerpt(content: string, maxLength = 160): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }
}

export const blogService = new BlogService();