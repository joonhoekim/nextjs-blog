// route.ts에서 분리함.

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { User as PrismaUser } from '@prisma/client';
import { Session } from 'inspector/promises';
import NextAuth, { NextAuthOptions, Account, Profile, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import { slugify } from './lib/utils/slugify';
import { log } from 'console';

interface SignInParams {
  user: User;
  account: Account | null;
  profile?: Profile;
}

interface SessionParams {
  session: Session;
  user: User;
  token: JWT;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    // return true 는 해당 콜백이 redirect를 하게 만든다.
    async signIn({ user, account, profile }: SignInParams) {
      try {
        // 1. db 내 유저 확인
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        // 2. guard clause 적용
        // 이미 유저가 있는 경우
        if (dbUser) {
          // 처리
          return true;
        }
        // 새로운 유저인 경우
        // 처리
        return true;
      } catch (e) {
        console.log('sign-in error:', e);
      }
    },
  },
  events: {
    // user slug 처리 필요
    async createUser({ user }) {
      try {
        const slug = user.email?.split('@')[0];
        await prisma.user.update({
          where: { id: user.id },
          data: { slug },
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  pages: {
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
export const handler = NextAuth(authOptions);
export const { auth, signIn, signOut } = handler;
