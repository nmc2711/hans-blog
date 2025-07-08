import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/auth-button';
import { dummyPosts } from '@/dummy-post';
import PostCard from '@/components/post-card';

function page() {
  const isAdmin = true;
  const posts = dummyPosts;
  const loading = false;
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <Link href='/' className='text-2xl font-bold'>
            황하프의 Tech Blog
          </Link>

          <div className='flex items-center space-x-4'>
            {isAdmin && (
              <Button asChild>
                <Link href='/admin/create'>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  글쓰기
                </Link>
              </Button>
            )}
            <AuthButton />
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto space-y-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>엉엉~ 황하프 Tech</h1>
            <p className='text-muted-foreground'>
              a clean functional blog focused on great content
            </p>
          </div>
          {loading ? (
            <div className='text-center'>로딩중..</div>
          ) : posts.length === 0 ? (
            <div className='text-center text-muted-foreground'>
              아직 작성한 글이 없네용!. {isAdmin && '글써라 상한아..'}
            </div>
          ) : (
            <div className='space-y-6'>
              {posts.map((p) => {
                return <PostCard key={p.id} post={p} />;
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default page;
