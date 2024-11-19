'use server';

import { prisma } from '@/lib/prisma';
import { Post } from '@prisma/client';

export async function getAllPosts(): Promise<Post[]> {
  return prisma.post.findMany();
}

export async function createPost(data: {
  title: string;
  content: string;
  published?: boolean;
}): Promise<Post> {
  return prisma.post.create({
    data: {
      ...data,
      published: data.published ?? false,
    },
  });
}
