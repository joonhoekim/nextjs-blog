// app/profile/actions.ts
'use server';

import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(handle: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { handle },
  });

  // Profile 페이지 재검증
  revalidatePath('/profile');
}
