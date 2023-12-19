import prisma  from '@/lib/prisma'
import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id + '',
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          // randomKey: 'TEST'
        }
      }
    })
  ],
  // callbacks: {
  //   session: ({ session, token }) => {
  //     console.log('Session Callback', { session, token })
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: token.id,
  //         randomKey: token.randomKey
  //       }
  //     }
  //   },
  //   jwt: ({ token, user }) => {
  //     console.log('JWT Callback', { token, user })
  //     if (user) {
  //       const u = user as unknown as any
  //       return {
  //         ...token,
  //         id: u.id,
  //         randomKey: u.randomKey
  //       }
  //     }
  //     return token
  //   }
  // }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }