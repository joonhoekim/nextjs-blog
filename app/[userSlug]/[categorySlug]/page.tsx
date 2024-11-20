
interface CategoryParams {
    userSlug: string;
    categorySlug: string;
}

export default async function Post(
    { params }: { params: CategoryParams }
) {
    const { userSlug, categorySlug } = params;


    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                <p>params: {[userSlug, categorySlug].join('/')}</p>
            </div>
        </div >
    );
}
