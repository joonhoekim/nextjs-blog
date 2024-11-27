import { auth, authOptions } from "@/auth"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"


export default async function ProfilePage() {

    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/api/auth/signin')
    }

    const handle = session.user?.name;


    return (
        <div>
            <h1>Profile page</h1>
            <p>your handle: {handle}</p>
        </div>
    )
}