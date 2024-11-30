// app/[handle]/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

// Create category action
export async function createCategory({
  name,
  slug,
  handle,
}: {
  name: string;
  slug: string;
  handle: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { handle },
  });

  if (!user || user.email !== session.user.email) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      userId: user.id,
    },
  });

  revalidatePath(`/${handle}`);
  return category;
}

// Update category action
export async function updateCategory({
  id,
  name,
  slug,
}: {
  id: string;
  name: string;
  slug: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const category = await prisma.category.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!category || category.user.email !== session.user.email) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath(`/${category.user.handle}`);
  return updated;
}

// Delete category action
export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const category = await prisma.category.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!category || category.user.email !== session.user.email) {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath(`/${category.user.handle}`);
}
