import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          isAdmin: user.isAdmin,
          isForumMod: user.isForumMod,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.id as unknown as number;
        token.isAdmin = user.isAdmin as boolean;
        token.isForumMod = user.isForumMod as boolean;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.uid as number;
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.isForumMod = token.isForumMod as boolean;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
