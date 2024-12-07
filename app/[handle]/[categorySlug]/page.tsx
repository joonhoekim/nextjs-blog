import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { authorizeUserWithHandle } from "../actions";
import { getUserIncludePost } from "./actions";
import { stringify } from "querystring";

interface CategoryParams {
    handle: string;
    categorySlug: string;
}

export default async function Post(
    { params }: { params: CategoryParams }
) {
    const { handle, categorySlug } = params;
    const session = await getServerSession(authOptions);
    const authorizedUser = await authorizeUserWithHandle(handle)
    const posts = await (await getUserIncludePost(handle, categorySlug)).posts;
    const isOwner = authorizedUser.email === session?.user?.email;


    return (
        <div className="max-w-screen-md mx-auto p-4">
            <PostList posts={posts} isOwner={isOwner}
        </div>
    );
}
