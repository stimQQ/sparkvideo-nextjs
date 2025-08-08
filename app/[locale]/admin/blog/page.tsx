'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogService, BlogPost } from '@/app/services/blog.service';
import { formatDate } from '@/app/lib/utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { posts } = await blogService.getAllPosts({
        status: filter.status === 'all' ? undefined : filter.status,
        search: filter.search || undefined,
        page: filter.page,
        limit: filter.limit,
      });
      setPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // 使用模拟数据
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    try {
      await blogService.deletePost(id);
      await loadPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await blogService.publishPost(id);
      await loadPosts();
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const getMockPosts = (): BlogPost[] => [
    {
      id: '1',
      title: '如何使用AI技术提升视频质量',
      slug: 'ai-video-enhancement',
      content: '内容...',
      excerpt: '探索最新的AI视频增强技术...',
      author: 'Admin',
      category: 'tutorial',
      tags: ['AI', '视频处理'],
      status: 'published',
      views: 1250,
      language: 'zh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: '音频转录技术的发展趋势',
      slug: 'audio-transcription-trends',
      content: '内容...',
      excerpt: '了解音频转录技术的最新进展...',
      author: 'Admin',
      category: 'technology',
      tags: ['音频', '转录'],
      status: 'draft',
      views: 0,
      language: 'zh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {status === 'published' ? '已发布' : status === 'draft' ? '草稿' : '已归档'}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">博客文章管理</h1>
        <Link href="/admin/blog/new" className="btn-primary">
          新建文章
        </Link>
      </div>

      {/* 过滤器 */}
      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="搜索文章..."
            className="input flex-1"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            className="select"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">暂无文章</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">标题</th>
                  <th className="text-left p-4">作者</th>
                  <th className="text-left p-4">分类</th>
                  <th className="text-left p-4">状态</th>
                  <th className="text-left p-4">浏览量</th>
                  <th className="text-left p-4">更新时间</th>
                  <th className="text-left p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-accent/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">{post.author}</td>
                    <td className="p-4">{post.category}</td>
                    <td className="p-4">{getStatusBadge(post.status)}</td>
                    <td className="p-4">{post.views}</td>
                    <td className="p-4">
                      <p className="text-sm">{formatDate(post.updated_at)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-sm text-primary hover:underline"
                        >
                          编辑
                        </Link>
                        {post.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="text-sm text-green-600 hover:underline"
                          >
                            发布
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-destructive hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}