'use server';

import prisma from '@/lib/db';
import { Post } from '@prisma/client';

export async function getAllPosts(): Promise<Post[]> {
  return prisma.post.findMany();
}
