'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useTransition } from 'react';

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
}

export default function EditPostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id as string}`);
        if (response.ok) {
          const data: Post = await response.json();
          if (data.author.id !== session?.user?.id) {
            setError('수정 권한이 없습니다.');
            return;
          }
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError('포스팅을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('포스팅 불러오기 실패');
        console.error(err);
      }
    };

    if (params.id && session?.user?.id) {
      fetchPost();
    }
  }, [params.id, session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${params.id as string}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          setError('수정 실패: ' + errorData.error);
        }
      } catch (err) {
        setError('수정 중 오류 발생');
        console.error(err);
      }
    });
  };

  if (!post && !error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>{error}</h1>
          <Button asChild>
            <Link href={`/post/${params.id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              뒤로가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' asChild>
            <Link href={`/post/${params.id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
              뒤로가기
            </Link>
          </Button>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl font-bold mb-6'>글 수정</h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목'
              required
              aria-label='제목'
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='내용'
              required
              rows={10}
              aria-label='내용'
            />
            {error && <p className='text-red-500'>{error}</p>}
            <Button type='submit' disabled={isPending} aria-label='저장'>
              <Save className='h-4 w-4 mr-2' aria-hidden='true' />
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
