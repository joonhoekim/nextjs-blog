// app/[handle]/[categorySlug]/PostList.tsx
"use client";

import { Post } from "@prisma/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card } from "primereact/card";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { renamePost } from "./actions";

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
  // Track which post is being edited and its temporary title
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const handleStartRename = (post: Post) => {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
  };

  const handleRename = async (postId: string) => {
    if (!editingTitle.trim() || isRenaming) return;

    try {
      setIsRenaming(true);
      await renamePost(postId, editingTitle);
      setEditingPostId(null);
      // Optionally refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to rename post:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: string) => {
    if (e.key === 'Enter') {
      handleRename(postId);
    } else if (e.key === 'Escape') {
      setEditingPostId(null);
    }
  };

  return (
      <div>
        <Card
            title={
              <div className="flex justify-between items-center">
                <span>Posts</span>
                {isOwner && (
                    <Link href={`${pathname}/new`}>
                      <Button label="New Post" />
                    </Link>
                )}
              </div>
            }
        >
          <ul className="list-none p-0 m-0">
            {posts.map((post) => (
                <li key={post.id} className="mb-2 flex items-center gap-2">
                  {editingPostId === post.id ? (
                      // Editing mode
                      <div className="flex-grow flex gap-2">
                        <InputText
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, post.id)}
                            className="flex-grow"
                            autoFocus
                            disabled={isRenaming}
                        />
                        <Button
                            icon="pi pi-check"
                            outlined
                            size="small"
                            onClick={() => handleRename(post.id)}
                            loading={isRenaming}
                            tooltip="Save"
                        />
                        <Button
                            icon="pi pi-times"
                            outlined
                            size="small"
                            onClick={() => setEditingPostId(null)}
                            disabled={isRenaming}
                            tooltip="Cancel"
                        />
                      </div>
                  ) : (
                      // Display mode
                      <>
                        <Link
                            href={`${pathname}/${post.slug}`}
                            className="cursor-pointer hover:text-primary flex-grow"
                        >
                          {post.title}
                        </Link>
                        {isOwner && (
                            <div className="flex gap-2">
                              <Link href={`${pathname}/${post.slug}/edit`}>
                                <Button
                                    icon="pi pi-pencil"
                                    outlined
                                    size="small"
                                    tooltip="Edit post"
                                />
                              </Link>
                              <Button
                                  icon="pi pi-tag"
                                  outlined
                                  size="small"
                                  tooltip="Rename post"
                                  onClick={() => handleStartRename(post)}
                              />
                            </div>
                        )}
                      </>
                  )}
                </li>
            ))}
          </ul>
        </Card>
      </div>
  );
}