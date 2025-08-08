'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/app/services/blog.service';
import BlogEditor from '@/app/components/admin/blog-editor';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const post = await blogService.createPost(data);
      router.push(`/admin/blog/${post.id}/edit`);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('创建文章失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">新建文章</h1>
        <p className="text-muted-foreground mt-2">创建新的博客文章</p>
      </div>

      <BlogEditor
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}