// /app/[handle]/page.tsx
import { authorizeUserWithHandle, getUserIncludeCategory } from './actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import CategoryList from './CategoryList'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Session } from 'next-auth';

export default async function UserProfilePage({
    params
}: {
    params: { handle: string }
}) {
    const { handle } = params;
    const session = await getServerSession(authOptions);
    const authorizedUser = await authorizeUserWithHandle(params.handle);
    const categories = (await getUserIncludeCategory(params.handle)).categories;

    const isOwner = authorizedUser.email === session?.user?.email

    return (
        <>
            <div className="max-w-screen-md mx-auto p-4">
                <CategoryList categories={categories} isOwner={isOwner} handle={handle} />
            </div>
        </>
    )
}