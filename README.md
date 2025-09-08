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
# NextAuth.js 설정 (필수)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_minimum_32_characters

# Google OAuth 설정 (필수)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 허용된 관리자 이메일 (필수)
ADMIN_EMAILS=admin@yourschool.edu,principal@yourschool.edu
```

### 🔐 **구글 로그인 전용 관리자 시스템**

이 프로젝트는 **구글 계정 로그인만** 지원하며, **허용된 이메일 주소**만 관리자로 접근할 수 있습니다.

### Google OAuth 설정 (필수)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Credentials" 이동
4. "Create Credentials" → "OAuth 2.0 Client IDs" 선택
5. 애플리케이션 유형: "Web application" 선택
6. 승인된 JavaScript 출처 추가:
   - `http://localhost:3000` (개발)
   - `https://your-domain.vercel.app` (배포)
7. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발)
   - `https://your-domain.vercel.app/api/auth/callback/google` (배포)
8. 클라이언트 ID와 시크릿을 `.env.local`에 추가

### 관리자 이메일 설정

`ADMIN_EMAILS` 환경변수에 관리자로 허용할 구글 계정 이메일을 추가하세요:
```env
ADMIN_EMAILS=admin@school.edu,principal@school.edu,teacher@school.edu
```

⚠️ **중요**: 이 환경변수에 포함되지 않은 구글 계정은 로그인이 거부됩니다.

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
