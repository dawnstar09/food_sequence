# Food Sequence

Next.js 구조로 React를 사용한 박스 표시 프로젝트입니다. 1-1부터 1-10까지의 번호가 매겨진 박스들을 그리드 형태로 표시합니다.

## 기능

- 1-1부터 1-10까지 총 10개의 박스 표시
- 반응형 그리드 레이아웃 (모바일: 2열, 태블릿: 3열, 데스크톱: 5열)
- Tailwind CSS를 이용한 스타일링
- TypeScript 지원

## 기술 스택

- Next.js 15.5.1
- React 18
- TypeScript
- Tailwind CSS
- ESLint

## 시작하기

### 환경변수 설정

1. `.env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요:
```bash
cp .env.example .env.local
```

2. `.env.local` 파일에서 실제 값들을 설정하세요:
```env
# 관리자 페이지 비밀번호
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here

# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth 설정 (선택사항)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 허용된 관리자 이메일 (구글 로그인용)
ADMIN_EMAILS=admin@example.com,manager@example.com
```

### Google OAuth 설정 (선택사항)

구글 로그인을 사용하려면 Google Cloud Console에서 OAuth 2.0 클라이언트를 설정해야 합니다:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Credentials" 이동
4. "Create Credentials" → "OAuth 2.0 Client IDs" 선택
5. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발)
   - `https://your-domain.vercel.app/api/auth/callback/google` (배포)
6. 클라이언트 ID와 시크릿을 `.env.local`에 추가

### Vercel 배포 시 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정해야 합니다:

- **Variable Name**: `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Value**: 실제 관리자 비밀번호
- **Environment**: Production, Preview, Development 모두 체크

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 시작

```bash
npm run start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
```

- `page.tsx`: 1-1부터 1-10까지의 박스를 표시하는 메인 페이지
- `layout.tsx`: 애플리케이션 전체 레이아웃
- `globals.css`: Tailwind CSS 전역 스타일
