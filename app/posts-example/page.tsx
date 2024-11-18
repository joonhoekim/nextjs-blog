import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function Posts() {
    return (
        <Card className="p-10 m-10">
            <h1>Server Component VS Client Component</h1>
            <p>서버컴포넌트로 만들거나 클라이언트컴포넌트로 만들거나 둘 다 가능하다.</p>
            <p>가능하면 서버컴포넌트로 만들고, 필요에 의해 클라이언트 컴포넌트로 전환하는 식으로 개발하면 된다.</p>
            <p>nextjs에서는 서버컴포넌트를 지원하는 강력한 기능이 많기 때문에, 복잡한 상태를 다루는 경우가 아니라면 최대한 서버컴포넌트로 쓰고, 특정 케이스만 클라이언트 컴포넌트로 분리하는 것이 좋다.</p>
            <p>tanstack query 등 클라이언트 컴포넌트의 단점을 상쇄하려는 좋은 접근들도 많지만, 일단 간단한 프로젝트에서 서버컴포넌트 사용이 성능도, 개발 생산성도 일반적으로 좋은 것으로 보인다.</p>

            <div className="flex justify-center p-10 m-10">
                <Link href={'/posts-example/server'}>
                    <Button className="m-4" label="Server Component" />
                </Link>

                <Link href={'/posts-example/client'}>
                    <Button className="m-4" label="Client Component" />
                </Link>
            </div>
        </ Card>
    )
}