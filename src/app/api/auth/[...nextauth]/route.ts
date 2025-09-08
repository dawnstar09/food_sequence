import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  pages: {
    signIn: '/admin/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 특정 관리자 이메일만 허용
      const allowedEmails = process.env.ADMIN_EMAILS?.split(',') || []
      
      if (user.email && allowedEmails.includes(user.email)) {
        return true
      }
      
      // 허용되지 않은 이메일
      return false
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    }
  }
})

export { handler as GET, handler as POST }
