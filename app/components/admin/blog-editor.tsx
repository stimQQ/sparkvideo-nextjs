'use client';

import { useState, useEffect } from 'react';
import { blogService } from '@/app/services/blog.service';

interface BlogEditorProps {
  post?: any;
  onSave: (data: any) => void;
  saving?: boolean;
}

export default function BlogEditor({ post, onSave, saving = false }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: [] as string[],
    status: 'draft',
    language: 'zh',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        tags: post.tags || [],
        meta_keywords: post.meta_keywords || [],
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || blogService.generateSlug(title),
    });
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
      excerpt: formData.excerpt || blogService.formatExcerpt(content),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        meta_keywords: [...formData.meta_keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      meta_keywords: formData.meta_keywords.filter(k => k !== keyword),
    });
  };

  const categories = [
    { value: 'general', label: '常规' },
    { value: 'tutorial', label: '教程' },
    { value: 'technology', label: '技术' },
    { value: 'news', label: '新闻' },
    { value: 'product', label: '产品' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">基本信息</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">标题 *</label>
            <input
              type="text"
              className="input w-full"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">URL Slug</label>
            <input
              type="text"
              className="input w-full"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              留空将自动生成
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">分类</label>
              <select
                className="select w-full"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">语言</label>
              <select
                className="select w-full"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">摘要</label>
            <textarea
              className="textarea w-full"
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="文章摘要（留空将自动生成）"
            />
          </div>
        </div>
      </div>

      {/* 内容编辑 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">文章内容</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">特色图片URL</label>
            <input
              type="url"
              className="input w-full"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="label">内容 *</label>
            <textarea
              className="textarea w-full font-mono text-sm"
              rows={20}
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="支持Markdown格式..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              支持Markdown格式
            </p>
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">标签</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="input flex-1"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="输入标签并按回车"
          />
          <button
            type="button"
            onClick={addTag}
            className="btn-secondary"
          >
            添加
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SEO设置 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">SEO设置</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">Meta标题</label>
            <input
              type="text"
              className="input w-full"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="留空使用文章标题"
            />
          </div>

          <div>
            <label className="label">Meta描述</label>
            <textarea
              className="textarea w-full"
              rows={2}
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="留空使用文章摘要"
            />
          </div>

          <div>
            <label className="label">关键词</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input flex-1"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="输入关键词并按回车"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="btn-secondary"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.meta_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 发布设置 */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">发布设置</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">状态</label>
            <select
              className="select w-full"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">草稿</option>
              <option value="published">发布</option>
              <option value="archived">归档</option>
            </select>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? '保存中...' : '保存文章'}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => window.history.back()}
        >
          取消
        </button>
      </div>
    </form>
  );
}