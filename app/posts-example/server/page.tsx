// 서버컴포넌트 + 서버액션으로 페이지 만들기 예시

import { getAllPosts } from '@/actions/post';
import { Button } from 'primereact/button';
import Link from 'next/link';

export default async function PostsList() {
    const posts = await getAllPosts();

    return (
        <div>
            <div className="mb-4">
                <Link href="/posts-example/form/server">
                    <Button label="Create New Post" icon="pi pi-plus" />
                </Link>
            </div>

            <div className="grid gap-4">
                {posts.map(post => (
                    <article key={post.id} className="p-4 border rounded">
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        <p>{post.content}</p>
                        <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                    </article>
                ))}
            </div>
        </div>
    );
}