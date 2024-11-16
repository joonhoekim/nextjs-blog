import prisma from "@/lib/db";

export default async function Home() {

  const posts = await prisma.post.findMany();

  return (
    <div>
      <h1>BLOG with nextjs</h1>

      <div>
        <p>여기에는 서비스 설명이 들어갈 예정임</p>
      </div>
    </div >
  );
}
