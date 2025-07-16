'use client';

import CommentSection from '@/components/comment-section';
import PostCard from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useTransition } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      startTransition(async () => {
        try {
          const response = await fetch(`/api/posts/${params.id as string}`, {
            cache: 'force-cache',
          });
          if (response.ok) {
            const data = await response.json();
            setPost(data);
          } else {
            setError('포스팅을 찾을 수 없습니다.');
          }
        } catch (err) {
          setError('포스팅 불러오기 실패');
          console.error(err);
        }
      });
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (isPending) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>포스팅을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            {error || '오류! 포스팅을 찾을 수가 없네요..'}
          </h1>
          <Button asChild>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              뒤로가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = session?.user?.id === post.author.id;

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' asChild>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
              뒤로가기
            </Link>
          </Button>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto space-y-8'>
          <PostCard post={post} showFullContent />
          {isAuthor && (
            <Button variant='outline' asChild aria-label='글 수정'>
              <Link href={`/posts/${post.id}/edit`}>
                <Edit className='h-4 w-4 mr-2' aria-hidden='true' />
                수정
              </Link>
            </Button>
          )}
          <CommentSection postId={post.id} />
        </div>
      </main>
    </div>
  );
}
