'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

// Create a new category
export async function createCategory(data: CategoryFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = CategorySchema.parse(data);

    // Check for duplicate slug
    const existing = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        slug: validated.slug,
      },
    });

    if (existing) {
      throw new Error('Slug already exists');
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
    });

    revalidatePath('/categories');
    return { success: true, data: category };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Update existing category
export async function updateCategory(
  categoryId: string,
  data: CategoryFormData
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Validate input data
    const validated = CategorySchema.parse(data);

    // Check ownership and existence
    const existing = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
    });

    if (!existing) {
      throw new Error('Category not found');
    }

    // Check for duplicate slug (excluding current category)
    const duplicate = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        slug: validated.slug,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (duplicate) {
      throw new Error('Slug already exists');
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: validated,
    });

    revalidatePath('/categories');
    revalidatePath(`/categories/${category.slug}`);
    return { success: true, data: category };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: (error as Error).message };
  }
}

// Delete category
export async function deleteCategory(categoryId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Check ownership and existence
    const existing = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: session.user.id,
      },
    });

    if (!existing) {
      throw new Error('Category not found');
    }

    // Delete category (will cascade delete posts due to prisma schema)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
