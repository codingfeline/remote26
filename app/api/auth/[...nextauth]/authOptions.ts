import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient()

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } })
        console.log(user)

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.hashedPassword!)

        return passwordsMatch ? user : null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    // signIn: '/auth/signIn'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    //? Helpful in v5 to ensure the session picks up the user ID from the JWT
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // 1. Define your public routes
      const staticPublicRoutes = ["/", "/password", "/journals", '/contact', '/jsPlayground'];
      const dynamicPublicPrefixes = ["/journals"];

      const isPublicPage =
        staticPublicRoutes.includes(pathname) ||
        dynamicPublicPrefixes.some(prefix => pathname.startsWith(prefix));

      // 2. If it's a public page, let anyone in
      if (isPublicPage) return true;

      // 3. If it's not public, only allow if logged in
      // Returning 'false' here automatically redirects to /api/auth/signin
      return isLoggedIn;
    },
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)