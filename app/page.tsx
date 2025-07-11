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
import { useEffect, useState } from 'react';

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

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('포스트 업로드 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const isAdmin = session?.user?.role === 'ADMIN';
  // [수정됨] 줄바꿈을 위해 텍스트를 두 부분으로 분리
  const animatedTextPart1 = '엉엉~ 씰룩씰룩';
  const animatedTextPart2 = '황하프의 개발 연구소';

  return (
    <>
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .wave-char {
          display: inline-block;
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
          position: absolute;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: bubbles 5s linear infinite;
        }
      `}</style>

      <div
        className='min-h-screen bg-cover bg-center bg-fixed'
        style={{ backgroundImage: 'url("/01.png")' }}
      >
        <header className='sticky top-0 z-50 w-full border-b border-white/20 bg-black/20 backdrop-blur-sm'>
          <TooltipProvider>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
              <Tooltip open>
                <TooltipTrigger asChild>
                  <Link
                    href='/'
                    className='text-xl sm:text-2xl font-bold whitespace-nowrap ml-6.5'
                  >
                    <Image
                      src='https://phinf.pstatic.net/contact/20250509_218/1746752174980z4he7_PNG/profileImage.png?type=s160'
                      alt='황하프 프로필 이미지'
                      width={44}
                      height={44}
                      className='
                        rounded-full object-cover
                        border-2 border-cyan-300/80
                        shadow-[0_0_10px_0_rgba(0,255,255,0.6)]
                        transition-all duration-300
                        hover:scale-110 hover:shadow-[0_0_20px_0_rgba(0,255,255,0.9)]
                      '
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>물범 누르면 메인가요</p>
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

        <main className='container mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-8'>
          <div className='mx-auto space-y-10'>
            <div className='relative text-center space-y-4 pt-10 pb-5 overflow-hidden'>
              <div
                className='bubble'
                style={{
                  left: '10%',
                  width: '15px',
                  height: '15px',
                  animationDelay: '0s',
                }}
              ></div>
              <div
                className='bubble'
                style={{
                  left: '20%',
                  width: '20px',
                  height: '20px',
                  animationDelay: '1.5s',
                }}
              ></div>
              <div
                className='bubble'
                style={{
                  left: '70%',
                  width: '10px',
                  height: '10px',
                  animationDelay: '3s',
                }}
              ></div>
              <div
                className='bubble'
                style={{
                  left: '85%',
                  width: '25px',
                  height: '25px',
                  animationDelay: '0.5s',
                }}
              ></div>

              <h1
                className={`${nanumPenScript.className} text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white`}
              >
                {animatedTextPart1.split('').map((char, index) => (
                  <span
                    key={`part1-${index}`}
                    className='wave-char'
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {char}
                  </span>
                ))}
                <span
                  className='wave-char hidden sm:inline'
                  style={{
                    animationDelay: `${animatedTextPart1.length * 0.05}s`,
                  }}
                >
                  {'\u00A0'}
                </span>
                <br className='sm:hidden' />
                {animatedTextPart2.split('').map((char, index) => (
                  <span
                    key={`part2-${index}`}
                    className='wave-char'
                    style={{
                      animationDelay: `${
                        (animatedTextPart1.length + 1 + index) * 0.05
                      }s`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
              <p className='text-lg sm:text-xl text-cyan-200/90 font-semibold'>
                사람들의 이야기를 듣는 것을 좋아하고
                <br />
                뒤뚱뒤뚱 달리는 취미를 가지고 있어요
              </p>

              <div className='absolute top-6 right-60 rounded-full p-0.5 border-3 border-dotted border-b-blue-300'>
                <Image
                  className='rounded-full w-44 h-44'
                  src='/03.gif'
                  alt='빼꼼 쳐다보는 하프물범'
                  width={32}
                  height={32}
                />
              </div>
            </div>

            {loading ? (
              <div className='text-center py-10'>
                <p className='text-white/80 font-semibold'>
                  하프물범이 글을 찾고 있어요...
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className='text-center py-10 px-6 bg-black/20 rounded-lg backdrop-blur-sm'>
                <p className='text-white/80'>
                  아직 작성된 글이 없네요!
                  {isAdmin && ' 첫 번째 글을 작성해서 블로그를 시작해보세요!'}
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                {posts.map((p) => (
                  <div key={p.id} className='rounded-xl overflow-hidden'>
                    <PostCard post={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className='py-6 mt-12 border-t border-white/20'>
          <div className='container mx-auto text-center text-sm text-white/70'>
            © {new Date().getFullYear()} HwangHarp. All Rights Reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
