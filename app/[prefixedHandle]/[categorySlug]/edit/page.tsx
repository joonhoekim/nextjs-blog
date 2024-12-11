"use client";

import { use, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { saveCategoryPost } from "@/app/[prefixedHandle]/actions";
import { slugify } from "@/lib/utils/slugify";

interface PostParams {
  handle: string;
  categorySlug: string;
}

type PageProps = {
  params: Promise<PostParams> | PostParams;
};

export default function EditPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params as Promise<PostParams>);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const handlePostSave = async () => {
    try {
      setIsSaving(true);
      await saveCategoryPost(
        resolvedParams.handle,
        resolvedParams.categorySlug,
        title,
        content,
      );
      router.push(
        `/${resolvedParams.handle}/${resolvedParams.categorySlug}/${slugify(title)}`,
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <InputText
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="w-full mb-4"
      />
      <Editor
        value={content}
        onTextChange={(e) => setContent(e.htmlValue!)}
        style={{ height: "500px" }}
      />
      {/*버튼영역*/}
      <div className="flex gap-2 m-4">
        <Button
          label={"Cancel"}
          severity={"danger"}
          onClick={() => router.back()}
        />
        <Button
          label={"Save"}
          severity={"success"}
          onClick={handlePostSave}
          loading={isSaving}
        />
      </div>
    </div>
  );
}
