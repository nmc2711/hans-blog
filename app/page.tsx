'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import AuthButton from '@/components/auth-button';
import PostCard from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { Nanum_Pen_Script } from 'next/font/google';

const nanumPenScript = Nanum_Pen_Script({
  weight: '400',
  subsets: ['latin'],
});

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

function Header({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-white/20 bg-black/20 backdrop-blur-sm'>
      <TooltipProvider>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
          <Tooltip open>
            <TooltipTrigger asChild>
              <Link
                href='/'
                className='text-xl sm:text-2xl font-bold whitespace-nowrap ml-6.5'
                aria-label='메인으로 돌아가기'
              >
                <Image
                  src='https://phinf.pstatic.net/contact/20250509_218/1746752174980z4he7_PNG/profileImage.png?type=s160'
                  alt='황하프 프로필 이미지'
                  width={44}
                  height={44}
                  className='rounded-full object-cover border-2 border-cyan-300/80 shadow-[0_0_10px_0_rgba(0,255,255,0.6)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_0_rgba(0,255,255,0.9)]'
                  priority
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>메인으로</p>
            </TooltipContent>
          </Tooltip>

          <div className='flex items-center space-x-2 sm:space-x-4'>
            {isAdmin && (
              <Button asChild size='sm' className='max-sm:h-9 max-sm:px-2'>
                <Link href='/admin/create'>
                  <PlusCircle className='h-4 w-4 mr-0 sm:mr-2' />
                  <span className='hidden sm:inline'>글쓰기</span>
                </Link>
              </Button>
            )}
            <AuthButton />
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
}

function HeroSection() {
  const animatedTextPart1 = '엉엉~ 씰룩씰룩';
  const animatedTextPart2 = '황하프의 개발 연구소';

  const part1Chars = useMemo(() => animatedTextPart1.split(''), []);
  const part2Chars = useMemo(() => animatedTextPart2.split(''), []);

  const bubbles = useMemo(
    () => [
      { left: '10%', size: 15, delay: 0 },
      { left: '20%', size: 20, delay: 1.5 },
      { left: '70%', size: 10, delay: 3 },
      { left: '85%', size: 25, delay: 0.5 },
    ],
    []
  );

  return (
    <div className='relative text-center space-y-4 pt-10 pb-5 overflow-visible'>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className='bubble absolute rounded-full bg-white/30'
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      <h1
        className={`${nanumPenScript.className} text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white inline-block`}
      >
        {part1Chars.map((char, index) => (
          <span
            key={`part1-${index}`}
            className='wave-char inline-block animate-wave [animation-delay:calc(theme(spacing.1)*var(--delay))]'
            style={{ '--delay': index } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
        <span
          className='wave-char inline-block animate-wave hidden sm:inline [animation-delay:calc(theme(spacing.1)*var(--delay))]'
          style={{ '--delay': part1Chars.length } as React.CSSProperties}
        >
          {'\u00A0'}
        </span>
        <br className='sm:hidden' />
        {part2Chars.map((char, index) => (
          <span
            key={`part2-${index}`}
            className='wave-char inline-block animate-wave [animation-delay:calc(theme(spacing.1)*var(--delay))]'
            style={
              {
                '--delay': part1Chars.length + 1 + index,
              } as React.CSSProperties
            }
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <p className='text-lg sm:text-xl text-cyan-200/90'>
        사람들의 이야기를 듣는 것을 좋아하고
        <br />
        뒤뚱뒤뚱 달리는 취미를 가지고 있어요
      </p>

      <div className='absolute top-[-1%] right-[2%] sm:top-[-1%] sm:-right-[6%] lg:right-[2%] md:top-[3%] md:-right-[4%] rounded-full p-0.5 border-4 border-dotted border-blue-300 z-10'>
        <Image
          className='rounded-full w-[19vw] h-[19vw] sm:w-[13vw] sm:h-[13vw] md:w-[8vw] md:h-[8vw] lg:w-[13vw] lg:h-[13vw] min-w-[80px] min-h-[80px] max-w-[176px] max-h-[176px] object-cover'
          src='/03.gif'
          alt='빼꼼 쳐다보는 하프물범'
          width={176}
          height={176}
          sizes='(max-width: 640px) 19vw, (max-width: 768px) 17vw, (max-width: 1024px) 12vw, (max-width: 1280px) 14vw, 176px'
          priority
        />
      </div>
    </div>
  );
}

function PostsGrid({
  posts,
  loading,
  error,
  isAdmin,
}: {
  posts: Post[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}) {
  const memoizedPosts = useMemo(() => posts, [posts]);

  if (error) {
    return (
      <div className='text-center py-10 px-6 bg-black/20 rounded-lg backdrop-blur-sm'>
        <p className='text-red-400 font-semibold'>글 불러오기 실패: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='text-center py-10'>
        <p className='text-white/80 font-semibold'>
          하프물범이 글을 찾고 있어요...
        </p>
      </div>
    );
  }

  if (memoizedPosts.length === 0) {
    return (
      <div className='text-center py-10 px-6 bg-black/20 rounded-lg backdrop-blur-sm'>
        <p className='text-white/80'>
          아직 작성된 글이 없네요!
          {isAdmin && ' 첫 번째 글을 작성해서 블로그를 시작해보세요!'}
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
      {memoizedPosts.map((p) => (
        <div key={p.id} className='rounded-xl overflow-hidden'>
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className='py-6 mt-12 border-t border-white/20'>
      <div className='container mx-auto text-center text-sm text-white/70'>
        © {new Date().getFullYear()} HwangHarp. All Rights Reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts', { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-wave {
          animation: wave 2.5s ease-in-out infinite;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2),
            0 0 1em rgba(255, 255, 255, 0.5), 0 0 0.2em rgba(255, 255, 255, 0.4);
        }

        @keyframes bubbles {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
          }
        }
        .bubble {
          animation: bubbles 5s linear infinite;
        }
      `}</style>

      <div
        className='min-h-screen bg-cover bg-center bg-fixed'
        style={{ backgroundImage: 'url("/01.png")' }}
      >
        <Header isAdmin={isAdmin} />

        <main className='container mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-8'>
          <div className='mx-auto space-y-10'>
            <HeroSection />
            <PostsGrid
              posts={posts}
              loading={loading}
              error={error}
              isAdmin={isAdmin}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
