// app/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import UserCTA from './UserCTA';
import { prisma } from '@/lib/prisma';

export default async function Home() {

  // Get session
  const session = await getServerSession(authOptions);

  // Fetch user data only if session exists
  const user = session?.user?.email
      ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      : null;

  // Use nullish coalescing for handle
  const handle = user?.handle ?? null;

  return (
      <div>
        <h1>BLOG with nextjs</h1>
        <div>
          <p>여기에는 서비스 설명이 들어갈 예정임</p>
        </div>
        {/* Only render UserCTA if handle exists */}
        {handle && <UserCTA
            key='1'
            data-aos="fade-up"
            data-aos-delay="100"
            handle={handle}/>
        }

      </div>
  );
}