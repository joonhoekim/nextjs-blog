"use client";

import type { Category } from "@prisma/client";
import Link from "next/link";
import { Card } from "primereact/card";
import { usePathname } from "next/navigation";
import React, { useState, useTransition } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { addCategory } from "./actions";
import { Button } from "primereact/button";

export default function CategoryList({
  categories,
  isOwner,
  handle,
}: {
  categories: Category[];
  isOwner: boolean;
  handle: string;
}) {
  const pathname = usePathname();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    startTransition(async () => {
      await addCategory(handle, newCategoryName);
      setNewCategoryName("");
    });
  };

  return (
    <div>
      {isOwner && (
        <form
          onSubmit={handleCategoryCreate}
          className="flex justify-end gap-2"
        >
          <FloatLabel className="">
            <InputText
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <label htmlFor="category name">Category Name</label>
          </FloatLabel>
          <Button
            type="submit"
            disabled={isPending || !newCategoryName.trim()}
            loading={isPending}
          >
            Add
          </Button>
        </form>
      )}
      <Card title="Categories">
        <ul className="list-none p-0 m-0">
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <Link
                href={`${pathname}/${category.slug}`}
                className="cursor-pointer hover:text-primary"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
