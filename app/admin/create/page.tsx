'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/markdown-renderer';

export default function CreatePostPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, published }),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
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
              <ArrowLeft className='h-4 w-4 mr-2' />
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
              {preview ? 'Edit' : 'Preview'}
            </Button>
          </div>

          <div
            className={`grid grid-cols-1 ${preview && 'lg:grid-cols-2 gap-8'}`}
          >
            <Card>
              <CardHeader>
                <CardTitle>포스팅</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>제목</Label>
                    <Input
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='타이틀을 입력하세요...'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='content'>본문 (Markdown)</Label>
                    <Textarea
                      id='content'
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder='본문을 입력하세요...'
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
                    <Label htmlFor='published'>즉시발행</Label>
                  </div>

                  <Button type='submit' disabled={loading} className='w-full'>
                    {loading ? '업로드 진행중..' : '업로드'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>프리뷰</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <h2 className='text-2xl font-bold'>{title || '글 제목'}</h2>
                    {/* <MarkdownRenderer
                      content={content || '마크다운 컨텐츠 작성...'}
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
