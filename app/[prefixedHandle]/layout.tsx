// app/[handle]/layout.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import UserLayoutClient from "./UserLayoutClient";
import {extractHandleFromParam} from "@/lib/utils/handle";
import {getCategoriesByHandle, getUserEmailByHandle} from "@/app/[prefixedHandle]/actions";

interface UserLayoutProps {
  children: React.ReactNode;
  params: {
    prefixedHandle: string;
  };
}

export default async function UserLayout({
  children,
    params,
}: UserLayoutProps) {

  const { prefixedHandle } = params;
  const handle = extractHandleFromParam(prefixedHandle);
  const dbEmail = await getUserEmailByHandle(handle);
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.email === dbEmail;
  const categories = await getCategoriesByHandle(handle);

  return (
    <UserLayoutClient categories={categories} isOwner={isOwner} >
      {children}
    </UserLayoutClient>
  );
}
