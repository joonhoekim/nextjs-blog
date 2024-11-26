// /app/actions/user.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * Get current user's profile with related data
 * Useful for profile pages and settings
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { user: null, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        handle: true,
        role: true,
        _count: {
          select: {
            Post: true,
            Comment: true,
          },
        },
      },
    });

    return { user, error: null };
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return { user: null, error: 'Failed to fetch user data' };
  }
}

/**
 * Get user profile by handle
 * Public information only
 */
export async function getUserProfile(handle: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        handle: true,
        createdAt: true,
        _count: {
          select: {
            Post: true,
            Comment: true,
          },
        },
      },
    });

    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return { user: null, error: 'Failed to fetch user profile' };
  }
}

/**
 * Update current user's profile
 * Only allows updating certain fields
 */
export async function updateProfile(data: {
  name?: string;
  bio?: string;
  handle?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { user: null, error: 'Not authenticated' };
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        bio: data.bio,
        handle: data.handle,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        handle: true,
      },
    });

    // Revalidate both the profile page and the settings page
    revalidatePath(`/users/${user.handle}`);
    revalidatePath('/settings');

    return { user, error: null };
  } catch (error) {
    console.error('Failed to update profile:', error);
    if (error instanceof Error) {
      return { user: null, error: error.message };
    }
    return { user: null, error: 'Failed to update profile' };
  }
}
