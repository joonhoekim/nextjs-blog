// app/[handle]/layout.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { notFound } from "next/navigation";
import UserLayoutClient from "./UserLayoutClient";

interface UserLayoutProps {
  children: React.ReactNode;
  params: { prefixedHandle: string };
}

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const { prefixedHandle } = params;
  const handle = prefixedHandle.slice(1);

  const user = await prisma.user.findUnique({
    where: { handle },
    include: {
      categories: {
        orderBy: { name: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.email === user.email;

  return (
    <UserLayoutClient user={user} isOwner={isOwner} handle={handle}>
      {children}
    </UserLayoutClient>
  );
}
