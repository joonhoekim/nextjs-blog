import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import ProfileForm from './ProfileForm';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  return (
    <div>
      <h1>Profile</h1>
      <ProfileForm user={dbUser} />
    </div>
  );
}
