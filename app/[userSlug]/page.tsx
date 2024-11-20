
interface UserParams {
    userSlug: string;
}

export default async function Post(
    { params }: { params: UserParams }
) {
    const { userSlug } = params;


    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                <p>params: {[userSlug].join('/')}</p>
            </div>
        </div >
    );
}
