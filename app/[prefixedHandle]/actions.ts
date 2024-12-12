"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/slugify";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export async function getUserEmailByHandle(handle: string) {
  const user = prisma.user.findUnique({
    where: { handle },
    select: { email: true },
  });

  if (!user) {
    notFound(); // Next.js의 not-found.tsx로 라우팅
  }

  return user;
}

export async function getCategoriesByHandle(handle: string) {
  const categories = prisma.category.findMany({
    where: {
      user: {
        handle,
      },
    },
  });

  return categories;
}

// authorization logic
// server component / client component / action 각각에서 필요시 각각 검증 시행
// 아래는 action의 검증부가 공통적으로 사용되니까 추출한 것.
// - action에서 한번 더 검증하는 이유: 세션이 만료된 상태에서 액션이 수행되는 걸 방지하기 위함
// - client에서 세션으로 인증/인가 주의: 사용자가 session 값을 변경할 수 있으므로 UI 구성 등 간단한 경우에만 사용
export async function authorizeUserWithHandle(handle: string) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { handle: handle },
  });

  // authorization
  if (!user || user.email !== session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return user;
}

// 별도의 검증이 요구되지 않음. 카테고리 리스트를 받아오는 부분임.
// get user's category items
export async function getUserIncludeCategory(handle: string) {
  const user = await prisma.user.findUnique({
    where: { handle },
    include: {
      categories: {
        orderBy: {
          name: "desc",
        },
      },
    },
  });

  if (!user) {
    throw new Error("Author not found");
  }

  return user;
}

// create category action
export async function addCategory(handle: string, name: string) {
  // authorization
  const user = await authorizeUserWithHandle(handle);

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

// update category name
export async function updateCategory(
  handle: string,
  categoryId: string,
  newCategoryName: string,
) {
  // authorization
  const user = await authorizeUserWithHandle(handle);

  const category = await prisma.category.update({
    where: { id: categoryId, userId: user.id },
    data: {
      name: newCategoryName,
      slug: slugify(newCategoryName),
    },
  });

  return category;
}

// delete category action
export async function deleteCategory(handle: string, categoryId: string) {
  // authorization
  const user = await authorizeUserWithHandle(handle);

  const category = await prisma.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });

  revalidatePath(`/${handle}`);

  return category;
}

//-------------------  POST  -----------------------------

export async function getCategoryPosts(handle: string, categorySlug: string) {
  const userCategoryLists = await prisma.post.findMany({
    where: {
      user: { handle },
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: "desc" },
  });

  return userCategoryLists;
}

export async function saveCategoryPost(
  handle: string,
  categorySlug: string,
  title: string,
  content: string,
) {
  const user = await authorizeUserWithHandle(handle);
  const category = await prisma.category.findUnique({
    where: {
      userId_slug: {
        userId: user.id,
        slug: categorySlug,
      },
    },
  });
  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      slug: slugify(title),
      published: true,
      userId: user.id,
      categoryId: category!.id,
    },
  });
}

export async function getPost(
  handle: string,
  categorySlug: string,
  postSlug: string,
) {
  const post = await prisma.post.findFirst({
    where: {
      category: {
        user: {
          handle: handle,
        },
        slug: categorySlug,
      },
    },
    include: {
      category: true,
      user: true,
    },
  });

  return post;
}
