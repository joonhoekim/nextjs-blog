"use client";

import { useState } from "react";
import { Editor } from "primereact/editor";

export default function EditPage() {
  const [text, setText] = useState("");

  return (
    <div className="card">
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue!)}
        style={{ height: "500px" }}
      />
    </div>
  );
}
