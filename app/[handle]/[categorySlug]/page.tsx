
interface CategoryParams {
    handle: string;
    categorySlug: string;
}

export default async function Post(
    { params }: { params: CategoryParams }
) {
    const { handle, categorySlug } = params;


    return (
        <div>
            <h1>BLOG with nextjs</h1>

            <div>
                <p>params: {[handle, categorySlug].join('/')}</p>
            </div>
        </div >
    );
}
