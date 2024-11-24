'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const CommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(1000),
  postId: z.string().min(1, 'Post ID is required'),
  parentId: z.string().optional(),
});

export type CommentFormData = z.infer<typeof CommentSchema>;

// Create a new comment
export async function createComment(data: CommentFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = CommentSchema.parse(data);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: validated.postId },
      include: {
        category: true,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // If this is a reply, check if parent comment exists
    if (validated.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validated.parentId },
      });

      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      // Prevent nested replies (only allow one level of nesting)
      if (parentComment.parentId) {
        throw new Error('Cannot reply to a reply');
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: validated.content,
        postId: validated.postId,
        parentId: validated.parentId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/categories/${post.category.slug}/${post.slug}`);
    return { success: true, data: comment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Update existing comment
export async function updateComment(commentId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate content
    if (!content.trim()) {
      throw new Error('Content is required');
    }

    // Check ownership and existence
    const existing = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId: session.user.id,
      },
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Comment not found');
    }

    // Update comment
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(
      `/categories/${existing.post.category.slug}/${existing.post.slug}`
    );
    return { success: true, data: comment };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Soft delete comment
export async function deleteComment(commentId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Check ownership and existence
    const existing = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId: session.user.id,
      },
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Comment not found');
    }

    // Soft delete comment
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        content: '[deleted]',
      },
    });

    revalidatePath(
      `/categories/${existing.post.category.slug}/${existing.post.slug}`
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get comments for a post
// app/actions/comment.ts (continued)

// Get comments for a post
export async function getPostComments(postId: string) {
  try {
    // First get all parent comments
    const parentComments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only get parent comments
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: parentComments };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get comment count for a post
export async function getCommentCount(postId: string) {
  try {
    const count = await prisma.comment.count({
      where: {
        postId,
        isDeleted: false,
      },
    });

    return { success: true, data: count };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Get recent comments for a user's posts
export async function getRecentCommentsForUser(userId: string, limit = 5) {
  try {
    const recentComments = await prisma.comment.findMany({
      where: {
        post: {
          userId, // Comments on the user's posts
        },
        isDeleted: false,
        NOT: {
          userId, // Exclude user's own comments
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
    });

    return { success: true, data: recentComments };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Helper type for comment responses
export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: CommentWithUser[];
};

// Helper type for recent comments
export type RecentComment = CommentWithUser & {
  post: {
    id: string;
    title: string;
    slug: string;
    category: {
      slug: string;
    };
  };
};
