'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

export default function BlogPage() {
  const t = useTranslations();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock blog data - in real app, this would come from an API
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Advanced Video Compression Techniques',
        excerpt: 'Learn about the latest video compression algorithms and how they can reduce file sizes while maintaining quality.',
        content: 'Video compression is a crucial aspect of modern digital media...',
        author: 'John Smith',
        publishedAt: '2024-01-15',
        category: 'tutorials',
        tags: ['video', 'compression', 'optimization'],
        readTime: 8,
        featured: true,
      },
      {
        id: '2',
        title: 'AI-Powered Audio Transcription: The Future is Here',
        excerpt: 'Discover how artificial intelligence is revolutionizing audio transcription accuracy and speed.',
        content: 'AI has transformed the way we approach audio transcription...',
        author: 'Sarah Johnson',
        publishedAt: '2024-01-12',
        category: 'ai',
        tags: ['ai', 'transcription', 'audio'],
        readTime: 6,
        featured: true,
      },
      {
        id: '3',
        title: 'Best Practices for Video Format Conversion',
        excerpt: 'A comprehensive guide to choosing the right video formats for different use cases.',
        content: 'When converting video formats, there are several factors to consider...',
        author: 'Mike Chen',
        publishedAt: '2024-01-10',
        category: 'tutorials',
        tags: ['video', 'formats', 'conversion'],
        readTime: 5,
        featured: false,
      },
      {
        id: '4',
        title: 'The Rise of WebM: Why Modern Browsers Love It',
        excerpt: 'Exploring the benefits of WebM format and its growing adoption across web platforms.',
        content: 'WebM has become increasingly popular due to its efficiency...',
        author: 'Emily Davis',
        publishedAt: '2024-01-08',
        category: 'technology',
        tags: ['webm', 'browsers', 'web'],
        readTime: 4,
        featured: false,
      },
      {
        id: '5',
        title: 'SparkVideo API: Integration Made Simple',
        excerpt: 'Learn how to integrate SparkVideo processing capabilities into your applications.',
        content: 'Our API provides powerful video and audio processing features...',
        author: 'David Wilson',
        publishedAt: '2024-01-05',
        category: 'development',
        tags: ['api', 'integration', 'development'],
        readTime: 10,
        featured: false,
      },
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'tutorials', label: 'Tutorials' },
    { value: 'ai', label: 'AI & Technology' },
    { value: 'technology', label: 'Technology' },
    { value: 'development', label: 'Development' },
  ];

  const featuredPosts = posts.filter(post => post.featured);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem-20rem)]">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, tutorials, and updates from the SparkVideo team
            </p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8">Featured Posts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <article key={post.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium mr-3">
                        Featured
                      </span>
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{t('blog.minuteRead', { count: post.readTime })}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 hover:text-primary cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('blog.search')}
                className="input w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="select md:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{t('blog.minuteRead', { count: post.readTime })}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 hover:text-primary cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{post.author}</span>
                    <button className="text-primary text-sm font-medium hover:underline">
                      {t('blog.readMore')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination would go here in a real application */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="btn-ghost" disabled>
                  {t('common.previous')}
                </button>
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded">1</span>
                <button className="btn-ghost" disabled>
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}