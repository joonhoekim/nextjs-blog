
interface PostParams {
    handle: string;
    categorySlug: string;
    postSlug: string;
}

export default async function Post(
    { params }: { params: PostParams }
) {
    const { handle, categorySlug, postSlug } = params;


    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                <p>params: {[handle, categorySlug, postSlug].join('/')}</p>
            </div>
        </div >
    );
}
