import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/utils/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId: user.id,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json(
      { error: '좋아요 기능을 수행하는 중에 에러가 발생했어요 ㅠㅠ' },
      { status: 500 }
    );
  }
}
