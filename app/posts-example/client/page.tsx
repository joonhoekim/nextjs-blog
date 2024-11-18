// 클라이언트 컴포넌트로 만든 경우
// - tanstack query를 사용하여 캐싱/SSR 지원을 할 수 있다. (간단한 경우는 useEffect 훅으로 사용)

'use client'

import { getAllPosts } from "@/actions/post";
import type { Post } from "@prisma/client";
import Link from "next/link";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

export default function PostPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-4">
                <Link href="/posts-example/form/client">
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