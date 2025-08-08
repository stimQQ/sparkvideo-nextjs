'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatBytes } from '@/app/lib/utils';
import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'transcription' | 'manual' | 'imported';
  format: 'txt' | 'srt' | 'vtt' | 'json' | 'pdf' | 'docx';
  size: number;
  created_at: string;
  updated_at: string;
  task_id?: string;
  language?: string;
}

export default function DocumentsPage() {
  const t = useTranslations();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock documents data - in real app, this would come from an API
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Video Conference Transcription - Marketing Meeting',
        content: 'Welcome everyone to our weekly marketing meeting. Today we\'ll be discussing our Q1 campaign results and planning for Q2...',
        type: 'transcription',
        format: 'txt',
        size: 15420,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        task_id: 'task_123',
        language: 'en',
      },
      {
        id: '2',
        title: 'Podcast Episode #45 - AI in Video Processing',
        content: 'Host: Today we\'re joined by Dr. Sarah Johnson to discuss the latest developments in AI-powered video processing...',
        type: 'transcription',
        format: 'srt',
        size: 28540,
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T14:20:00Z',
        task_id: 'task_456',
        language: 'en',
      },
      {
        id: '3',
        title: 'Project Documentation - Video Compression Algorithm',
        content: 'This document outlines the implementation details of our new video compression algorithm. The algorithm uses...',
        type: 'manual',
        format: 'docx',
        size: 45120,
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-11T16:45:00Z',
      },
      {
        id: '4',
        title: 'Interview Transcription - User Research',
        content: 'Interviewer: Thank you for participating in our user research study. Can you tell us about your experience with video editing tools?',
        type: 'transcription',
        format: 'vtt',
        size: 12890,
        created_at: '2024-01-08T11:00:00Z',
        updated_at: '2024-01-08T11:00:00Z',
        task_id: 'task_789',
        language: 'en',
      },
      {
        id: '5',
        title: 'Meeting Notes - Technical Architecture Review',
        content: 'Architecture Review Meeting Notes\n\nAttendees: John, Sarah, Mike, Emily\n\nAgenda:\n1. Current system performance\n2. Scalability concerns\n3. Proposed improvements...',
        type: 'manual',
        format: 'txt',
        size: 8760,
        created_at: '2024-01-05T15:30:00Z',
        updated_at: '2024-01-06T10:20:00Z',
      },
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedDocs = documents
    .filter(doc => {
      if (filterType !== 'all' && doc.type !== filterType) return false;
      if (searchQuery.trim()) {
        return doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               doc.content.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleEdit = (doc: Document) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedDoc) {
      const updatedDoc = {
        ...selectedDoc,
        title: editTitle,
        content: editContent,
        updated_at: new Date().toISOString(),
      };
      setDocuments(docs => docs.map(doc => doc.id === selectedDoc.id ? updatedDoc : doc));
      setSelectedDoc(updatedDoc);
      setIsEditing(false);
    }
  };

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(docs => docs.filter(doc => doc.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
    }
  };

  const handleExport = (doc: Document, format: string) => {
    // In a real app, this would trigger an API call to export the document
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transcription':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'manual':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem-20rem)]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('document.title')}</h1>
              <p className="text-muted-foreground">
                Manage your transcriptions and documents
              </p>
            </div>
            <button className="btn-primary">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('document.create')}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Document List */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="input w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <select
                      className="select flex-1"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="date">Sort by Date</option>
                      <option value="title">Sort by Title</option>
                      <option value="type">Sort by Type</option>
                    </select>
                    <select
                      className="select flex-1"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="transcription">Transcriptions</option>
                      <option value="manual">Manual</option>
                      <option value="imported">Imported</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    ))
                  ) : filteredAndSortedDocs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No documents found</p>
                    </div>
                  ) : (
                    filteredAndSortedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                          selectedDoc?.id === doc.id ? 'bg-accent border-primary' : ''
                        }`}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              <span className="text-muted-foreground mr-2">
                                {getTypeIcon(doc.type)}
                              </span>
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {doc.format.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="font-medium truncate mb-1">{doc.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(doc.created_at)} • {formatBytes(doc.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Document Viewer/Editor */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-3">
                        {getTypeIcon(selectedDoc.type)}
                      </span>
                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input text-lg font-semibold"
                          />
                        ) : (
                          <h2 className="text-xl font-semibold">{selectedDoc.title}</h2>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(selectedDoc.created_at)} • 
                          {selectedDoc.updated_at !== selectedDoc.created_at && (
                            <span> Updated: {formatDate(selectedDoc.updated_at)} • </span>
                          )}
                          Size: {formatBytes(selectedDoc.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="btn-primary"
                          >
                            {t('common.save')}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditTitle(selectedDoc.title);
                              setEditContent(selectedDoc.content);
                            }}
                            className="btn-ghost"
                          >
                            {t('common.cancel')}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(selectedDoc)}
                            className="btn-ghost"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t('document.edit')}
                          </button>
                          <div className="relative">
                            <button className="btn-ghost">
                              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {t('document.export')}
                            </button>
                            {/* Export dropdown would be implemented here */}
                          </div>
                          <button
                            onClick={() => handleDelete(selectedDoc.id)}
                            className="btn-ghost text-destructive hover:text-destructive"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-96 p-4 border-none resize-none focus:outline-none focus:ring-0"
                        placeholder="Document content..."
                      />
                    ) : (
                      <div className="p-4 h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {selectedDoc.content}
                        </pre>
                      </div>
                    )}
                  </div>

                  {selectedDoc.task_id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Generated from transcription task: <code className="bg-background px-2 py-1 rounded">{selectedDoc.task_id}</code>
                        {selectedDoc.language && (
                          <span> • Language: <span className="font-medium">{selectedDoc.language.toUpperCase()}</span></span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card p-6">
                  <div className="text-center py-12">
                    <svg className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Select a document</h3>
                    <p className="text-muted-foreground">
                      Choose a document from the list to view or edit its content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}