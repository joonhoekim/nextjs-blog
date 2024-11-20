
interface PostParams {
    userSlug: string;
    categorySlug: string;
    postSlug: string;
}

export default async function Post(
    { params }: { params: PostParams }
) {
    const { userSlug, categorySlug, postSlug } = params;


    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                <p>params: {[userSlug, categorySlug, postSlug].join('/')}</p>
            </div>
        </div >
    );
}
