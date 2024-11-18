import { Metadata } from 'next';
import { createPost } from '@/actions/post';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

export const metadata: Metadata = {
    title: 'Create Post',
    description: 'Create a new post'
};

export default function CreatePost() {
    async function create(formData: FormData) {
        'use server'

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        await createPost({ title, content });
    }

    return (
        <div className="p-4">
            <h1>Create Post</h1>

            <form action={create} className="flex flex-col gap-4 max-w-lg">
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">Title</label>
                    <InputText
                        id="title"
                        name="title"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="content">Content</label>
                    <InputTextarea
                        id="content"
                        name="content"
                        rows={4}
                        required
                    />
                </div>

                <Button type="submit" label="Create Post" />
            </form>
        </div>
    );
}