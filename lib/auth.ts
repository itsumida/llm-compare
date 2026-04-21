import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getOrCreateUser, getUserByEmail } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Create user in Supabase if doesn't exist (with 10 free credits)
      await getOrCreateUser(user.email, user.name ?? null, user.image ?? null);
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        // Fetch current credits from database
        const dbUser = await getUserByEmail(session.user.email);
        if (dbUser) {
          session.credits = dbUser.credits;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
