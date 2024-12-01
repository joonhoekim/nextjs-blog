import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils/slugify';
import { getServerSession, User } from 'next-auth';
import { revalidatePath } from 'next/cache';

// create category action
export async function addCategory(handle: string, name: string) {
  // get auth info
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  // authorization
  if (!user || user.email !== session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const slug = slugify(name);

  // create category
  const category = await prisma.category.create({
    data: {
      name,
      userId: user.id,
      slug,
    },
  });

  // update cache
  revalidatePath(`/${handle}`);

  // if you want to use it... (ex. optimistic update)
  return category;
}

// delete category action
export async function deleteCategory(handle: string, categoryId: string) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  if (!user || user.email !== session?.user?.email) {
    throw new Error('Unauthorized');
  }

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
  handle: string,
  categoryId: string,
  newCategoryName: string
) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  if (!user || session?.user?.email !== user.email) {
    throw new Error('Unauthorized');
  }

  const categorySlug = slugify(newCategoryName);

  const category = await prisma.category.update({
    where: { id: categoryId, userId: user.id },
    data: {
      name: newCategoryName,
      slug: categorySlug,
    },
  });

  return category;
}
