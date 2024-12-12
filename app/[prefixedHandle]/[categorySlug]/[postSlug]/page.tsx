import { getPost } from "@/app/[prefixedHandle]/actions";

interface PostParams {
  handle: string;
  categorySlug: string;
  postSlug: string;
}

export default async function Post({ params }: { params: PostParams }) {
  const { handle, categorySlug, postSlug } = params;
  const post = await getPost(handle, categorySlug, postSlug);

  return (
    <div>
      <h1>BLOG with nextjs</h1>

      <div>
        <p>params: {[handle, categorySlug, postSlug].join("/")}</p>
        <p>{post!.title}</p>
        <p>{post!.content}</p>
      </div>
    </div>
  );
}
