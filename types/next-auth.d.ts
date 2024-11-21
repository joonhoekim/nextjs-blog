// app/types/next-auth.d.ts
// 나중에 활용하자...
import { DefaultSession } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { User as PrismaUser } from '@prisma/client';

// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      // Include other custom fields you want in session
    } & DefaultSession['user'];
  }
}

// Extend the built-in user type
declare module 'next-auth/adapters' {
  interface AdapterUser {
    id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    // Add other custom fields that match your Prisma schema
  }
}

// Utility function to transform Prisma User to AdapterUser
export const transformPrismaUserToAdapterUser = (
  prismaUser: PrismaUser
): AdapterUser => {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    emailVerified: prismaUser.emailVerified,
    role: prismaUser.role,
    name: prismaUser.name,
    image: prismaUser.image,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
  };
};
