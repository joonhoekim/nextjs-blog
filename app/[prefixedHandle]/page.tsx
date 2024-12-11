// /app/[handle]/page.tsx
import { authorizeUserWithHandle, getUserIncludeCategory } from './actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import CategoryList from './CategoryList'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Session } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function UserProfilePage({
    params
}: {
    params: { prefixedHandle: string }
}) {

    const prefixedHandle = decodeURIComponent(params.prefixedHandle);

    // handle must have prefix '@'
    if (!prefixedHandle.startsWith('@')) {
        console.log('invalid handle', prefixedHandle);
        return notFound();
    }

    const handle = prefixedHandle.slice(1);
    console.log(handle);

    const session = await getServerSession(authOptions);
    const authorizedUser = await authorizeUserWithHandle(handle);
    const categories = (await getUserIncludeCategory(handle)).categories;

    const isOwner = authorizedUser.email === session?.user?.email

    return (
        <>
            <div className="max-w-screen-md mx-auto p-4">
                <CategoryList categories={categories} isOwner={isOwner} handle={handle} />
            </div>
        </>
    )
}