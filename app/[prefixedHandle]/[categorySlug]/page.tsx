import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import {
  authorizeUserWithHandle,
  getCategoryPosts,
  getUserEmailByHandle,
} from "../actions";
import PostList from "@/app/[prefixedHandle]/[categorySlug]/PostList";
import { extractHandleFromParam } from "@/lib/utils/handle";

interface CategoryParams {
  prefixedHandle: string;
  categorySlug: string;
}

export default async function Post({ params }: { params: CategoryParams }) {
  const { prefixedHandle, categorySlug } = params;
  const handle = extractHandleFromParam(prefixedHandle);
  const session = await getServerSession(authOptions);
  const dbEmail = await getUserEmailByHandle(handle);
  const isOwner = dbEmail ? dbEmail! === session?.user?.email! : false;

  const posts = await getCategoryPosts(handle, categorySlug);

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <PostList posts={posts} isOwner={isOwner} />
    </div>
  );
}
