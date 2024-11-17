import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import bcrypt from "bcryptjs";

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
}

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  theme: { brandColor: "#000fff", colorScheme: "auto" },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token = {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      if (trigger === "update") {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
