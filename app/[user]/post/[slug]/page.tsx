import prisma from "@/lib/db";
import Link from "next/link";

export default async function Home() {

    const posts = await prisma.post.findMany();

    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.id}`}> {post.title} </Link>
                    </li>
                ))}
            </div>
        </div >
    );
}
