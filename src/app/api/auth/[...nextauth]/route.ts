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
    signIn: '/admin',
    error: '/admin/error', // 에러 페이지 추가
  },
  debug: true, // 디버깅 활성화
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 Login attempt:', { email: user.email, name: user.name })
      
      // 허용된 이메일 체크 (현재는 테스트용으로 53rlaehgus@gmail.com 허용)
      const allowedEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['53rlaehgus@gmail.com']
      
      console.log('✅ Allowed emails:', allowedEmails)
      
      if (user.email && allowedEmails.includes(user.email)) {
        console.log('✅ 허용된 이메일 접근 허용:', user.email)
        return true
      }
      
      // 허용되지 않은 이메일
      console.log('❌ 접근 거부 - 허용되지 않은 계정:', user.email)
      return false
    },
    async session({ session, token }) {
      console.log('📱 Session created for:', session.user?.email)
      return session
    },
    async jwt({ token, user }) {
      return token
    }
  },
  events: {
    async signIn({ user }) {
      console.log('🎉 Successful login:', user.email)
    },
    async signOut({ session }) {
      console.log('👋 User logged out:', session?.user?.email)
    }
  }
})

export { handler as GET, handler as POST }
