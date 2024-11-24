'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(500).optional().nullable(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional()
    .nullable(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

// Update user profile
export async function updateProfile(data: ProfileFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = ProfileSchema.parse(data);

    // Check for duplicate slug if provided
    if (validated.slug) {
      const existing = await prisma.user.findFirst({
        where: {
          slug: validated.slug,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existing) {
        throw new Error('Slug already taken');
      }
    }

    // Update profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validated,
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        slug: true,
        email: true,
      },
    });

    revalidatePath('/profile');
    if (user.slug) {
      revalidatePath(`/@${user.slug}`);
    }

    return { success: true, data: user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Get user profile by slug
export async function getProfileBySlug(slug: string) {
  try {
    const profile = await prisma.user.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            categories: true,
            Post: true,
            Comment: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get user's posts with pagination
export async function getUserPosts(
  userId: string,
  {
    page = 1,
    limit = 10,
    published = true,
  }: { page?: number; limit?: number; published?: boolean }
) {
  try {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          userId,
          published,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          category: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: {
          userId,
          published,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get user's categories
export async function getUserCategories(userId: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get user's activity summary
export async function getUserActivity(userId: string) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const [recentPosts, recentComments, totalStats] = await Promise.all([
      // Recent posts
      prisma.post.findMany({
        where: {
          userId,
          published: true,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        include: {
          category: true,
        },
      }),
      // Recent comments
      prisma.comment.findMany({
        where: {
          userId,
          isDeleted: false,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      }),
      // Total statistics
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          _count: {
            select: {
              Post: {
                where: {
                  published: true,
                },
              },
              Comment: {
                where: {
                  isDeleted: false,
                },
              },
              categories: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        recentPosts,
        recentComments,
        totalStats: totalStats?._count,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Delete user account and all associated data
export async function deleteUserAccount() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Delete user (will cascade delete all associated data due to schema relations)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Helper types
export type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  slug: string | null;
  createdAt: Date;
  _count: {
    categories: number;
    Post: number;
    Comment: number;
  };
};

export type UserActivity = {
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    post: {
      id: string;
      title: string;
      slug: string;
      category: {
        slug: string;
      };
    };
  }>;
  totalStats: {
    Post: number;
    Comment: number;
    categories: number;
  };
};

export type PaginatedPosts = {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    _count: {
      comments: number;
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
