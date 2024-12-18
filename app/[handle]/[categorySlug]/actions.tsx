// app/[handle]/[categorySlug]/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";

export async function renamePost(postId: string, newTitle: string) {
  const newSlug = slugify(newTitle);

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: newTitle,
        slug: newSlug,
      },
    });

    // Revalidate the post list page
    revalidatePath("/[handle]/[categorySlug]");

    return post;
  } catch (error) {
    console.error("Failed to rename post:", error);
    throw new Error("Failed to rename post");
  }
}

export async function editPost(
  categorySlug: string,
  postSlug: string,
  content: string,
) {
  // TODO: authentication required
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });

  if (!category) {
    // exception
  }

  const post = await prisma.post.update({
    where: {
      slug: postSlug,
      categoryId: category.id,
    },
    data: {
      content: content,
    },
  });

  return post;
}
