// /app/auth/username/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

async function setUsername(formData: FormData) {
    'use server'

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const username = formData.get('username') as string;
    const existing = await prisma.user.findUnique({
        where: { username }
    });

    if (existing) {
        throw new Error('Username already taken');
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: { username }
    });

    redirect('/');
}

export default async function UsernameForm() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/api/auth/signin');

    return (
        <form action={setUsername}>
            <input
                type="text"
                name="username"
                placeholder="Choose your username"
                pattern="[a-z0-9-]+"
                required
            />
            <button type="submit">Continue</button>
        </form>
    );
}