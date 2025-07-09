import prisma from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/utils/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true, image: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: '포스트 불러오기 실패' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  try {
    const { title, content, published } = await request.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: user.id,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: '글쓰기 실패..' }, { status: 500 });
  }
}
