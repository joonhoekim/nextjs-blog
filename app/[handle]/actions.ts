'use server';

import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils/slugify';
import { type Session } from 'next-auth';
import { revalidatePath } from 'next/cache';

// authorization logic
export async function authorizeUserWithHandle(
  session: Session,
  handle: string
) {
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  // authorization
  if (!user || user.email !== session?.user?.email) {
    throw new Error('Unauthorized');
  }

  return user;
}
// get user's category items
export async function getUserIncludeCategory(session: Session, handle: string) {
  const user = await prisma.user.findUnique({
    where: { handle },
    include: {
      categories: {
        orderBy: {
          name: 'desc',
        },
      },
    },
  });

  if (!user) {
    throw new Error('Author not found');
  }

  // authorization
  if (user.email !== session?.user?.email) {
    throw new Error('Unauthorized');
  }

  return user;
}

// create category action
export async function addCategory(
  session: Session,
  handle: string,
  name: string
) {
  // authorization
  const user = await authorizeUserWithHandle(session, handle);

  // create category
  const category = await prisma.category.create({
    data: {
      name,
      userId: user.id,
      slug: slugify(name),
    },
  });

  // update cache
  revalidatePath(`/${handle}`);

  // if you want to use it... (ex. optimistic update)
  return category;
}

// delete category action
export async function deleteCategory(
  session: Session,
  handle: string,
  categoryId: string
) {
  // authorization
  const user = await authorizeUserWithHandle(session, handle);

  const category = await prisma.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });

  revalidatePath(`/${handle}`);

  return category;
}

// update category name
export async function updateCategory(
  session: Session,
  handle: string,
  categoryId: string,
  newCategoryName: string
) {
  // authorization
  const user = await authorizeUserWithHandle(session, handle);

  const category = await prisma.category.update({
    where: { id: categoryId, userId: user.id },
    data: {
      name: newCategoryName,
      slug: slugify(newCategoryName),
    },
  });

  return category;
}
