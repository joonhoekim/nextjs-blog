import { authOptions } from "@/auth"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/api/auth/signin')
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!dbUser) {
        throw new Error('User not found')
    }

    let bio
    if (dbUser.bio == null) {
        bio = 'No Bio Now'
    } else {
        bio = dbUser.bio
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

            <h2>
                Name: {dbUser.name}
            </h2>

            <h2>
                Bio: {bio}
            </h2>
        </div>
    )
}