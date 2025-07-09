'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/router';

export default function CreatePostPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, published }),
      });

      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      console.log('포스팅 등록 실패', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' asChild>
            <Link href='/'>
              <ArrowLeft />
              돌아가기
            </Link>
          </Button>
        </div>
      </header>
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-between mb-8'>
            <h1 className='text-3xl font-bold'>새로운 포스팅 작성</h1>
            <Button variant='outline' onClick={() => setPreview(!preview)}>
              <Eye className='h-4 w-4 mr-2' />
              {preview ? '편집' : '미리보기'}
            </Button>
          </div>

          <div
            className={`grid grid-cols-1 ${preview && 'lg:grid-cols-2 gap-8'}`}
          >
            <Card>
              <CardHeader>
                <CardTitle>포스팅 작성</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>제목</Label>
                    <Input
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='제목을 입력해주세요!'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='content'>컨텐츠 (Markdown)</Label>
                    <Textarea
                      id='content'
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder='컨텐츠를 입력해주세요..'
                      rows={20}
                      required
                      className='min-h-80'
                    />
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='published'
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                    <Label htmlFor='published'>바로 게시</Label>
                  </div>
                  <Button type='submit' disabled={loading} className='w-full'>
                    {loading ? '게시중..' : '글등록'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {/* <h2 className='text-2xl font-bold'>
                      {title || 'Post Title'}
                    </h2>
                    <MarkdownRenderer
                      content={content || 'Your content will appear here...'}
                    /> */}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
