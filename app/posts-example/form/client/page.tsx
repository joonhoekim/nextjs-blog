
'use client';

import { createPost } from '@/actions/post';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

export default function PostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPost({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mb-8">
            <div className="flex flex-col gap-2">
                <label htmlFor="title">Title</label>
                <InputText
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="content">Content</label>
                <InputTextarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    required
                />
            </div>
            <Button type="submit" label="Create Post" />
        </form>
    );
}