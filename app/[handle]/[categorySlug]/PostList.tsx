"use client";

import { Post } from "@prisma/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card } from "primereact/card";
import React from "react";

export default function PostList({
  posts,
  isOwner,
  handle,
}: {
  posts: Post[];
  isOwner: boolean;
  handle: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <div>
        <Card title="Posts">
          <ul className="list-none p-0 m-0">
            {posts.map((post) => (
              <li key={post.id} className="mb-2">
                <Link
                  href={`${pathname}/${post.slug}`}
                  className="cursor-pointer hover:text-primary"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
