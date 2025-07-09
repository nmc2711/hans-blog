import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/utils/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  console.log(user);
  try {
    const { title, content, published } = await request.json();

    // const post = await prisma.post.create({
    //   data: {
    //     title,
    //     content,
    //     published: published || false,
    //     authorId: user.id,
    //   },
    //   include: {
    //     author: {
    //       select: { name: true, image: true },
    //     },
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch {}
}
