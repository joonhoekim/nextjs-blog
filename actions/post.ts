'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  published: z.boolean().optional(),
});

export type PostFormData = z.infer<typeof PostSchema>;

// Create a new post
export async function createPost(data: PostFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = PostSchema.parse(data);

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: validated.categoryId,
        userId: session.user.id,
      },
    });

    if (!category) {
      throw new Error('Invalid category');
    }

    // Check for duplicate slug in the same category
    const existing = await prisma.post.findFirst({
      where: {
        userId: session.user.id,
        categoryId: validated.categoryId,
        slug: validated.slug,
      },
    });

    if (existing) {
      throw new Error('Slug already exists in this category');
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
    });

    revalidatePath(`/categories/${category.slug}`);
    return { success: true, data: post };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Update existing post
export async function updatePost(postId: string, data: PostFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = PostSchema.parse(data);

    // Check ownership and existence
    const existing = await prisma.post.findFirst({
      where: {
        id: postId,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    if (!existing) {
      throw new Error('Post not found');
    }

    // Check if new category belongs to user
    if (validated.categoryId !== existing.categoryId) {
      const newCategory = await prisma.category.findFirst({
        where: {
          id: validated.categoryId,
          userId: session.user.id,
        },
      });

      if (!newCategory) {
        throw new Error('Invalid category');
      }
    }

    // Check for duplicate slug (excluding current post)
    const duplicate = await prisma.post.findFirst({
      where: {
        userId: session.user.id,
        categoryId: validated.categoryId,
        slug: validated.slug,
        NOT: {
          id: postId,
        },
      },
    });

    if (duplicate) {
      throw new Error('Slug already exists in this category');
    }

    // Update post
    const post = await prisma.post.update({
      where: { id: postId },
      data: validated,
      include: {
        category: true,
      },
    });

    revalidatePath(`/categories/${post.category.slug}`);
    revalidatePath(`/categories/${post.category.slug}/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Delete post
export async function deletePost(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Check ownership and existence
    const existing = await prisma.post.findFirst({
      where: {
        id: postId,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    if (!existing) {
      throw new Error('Post not found');
    }

    // Delete post (will cascade delete comments)
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath(`/categories/${existing.category.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
