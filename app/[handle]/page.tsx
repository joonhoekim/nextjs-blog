// /app/[handle]/page.tsx
import { getUserProfile } from '@/actions/user'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata(
    { params }: { params: { handle: string } }
): Promise<Metadata> {
    const { user } = await getUserProfile(params.handle)

    if (!user) {
        return {
            title: 'User Not Found',
        }
    }

    return {
        title: `${user.name}'s Profile`,
        description: user.bio || `Profile page of ${user.name}`,
        openGraph: {
            title: `${user.name}'s Profile`,
            description: user.bio || `Profile page of ${user.name}`,
            images: user.image ? [user.image] : [],
        },
    }
}

export default async function UserProfilePage({
    params
}: {
    params: { handle: string }
}) {
    const { user, error } = await getUserProfile(params.handle)

    if (error) {
        console.error('Error fetching user:', error)
        throw new Error(error)
    }

    if (!user) {
        notFound()
    }

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <Card>
                <div className="flex flex-column md:flex-row gap-4 items-start">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={`${user.name}'s profile`}
                                width={120}
                                height={120}
                                className="rounded-full"
                                priority
                            />
                        ) : (
                            <Avatar
                                icon="pi pi-user"
                                size="xlarge"
                                shape="circle"
                            />
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        <div className="text-lg text-gray-600 mb-4">@{user.handle}</div>

                        {user.bio && (
                            <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                                {user.bio}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex gap-4 text-sm text-gray-600">
                            <div>
                                <strong>{user._count.Post}</strong> posts
                            </div>
                            <div>
                                <strong>{user._count.Comment}</strong> comments
                            </div>
                            <div>
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}