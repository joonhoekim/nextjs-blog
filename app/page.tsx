
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import UserCTA from './UserCTA';
import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';
export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  const handle = user?.handle

  return (
    <div>
      <h1>BLOG with nextjs</h1>


      <div>
        <p>여기에는 서비스 설명이 들어갈 예정임</p>
      </div>
      <UserCTA handle={handle} />
    </div >
  );
}
