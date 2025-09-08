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
# JWT 인증 시스템 설정 (필수)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters

# 관리자 패스워드 (필수)
ADMIN_PASSWORD=your_secure_admin_password_here
```

### 🔐 **서버 사이드 JWT 인증 시스템**

이 프로젝트는 **보안을 최우선**으로 하는 JWT 기반 서버 사이드 인증을 사용합니다.

**✨ 보안 특징:**
- 🔒 서버 사이드 패스워드 검증
- 🍪 HttpOnly 쿠키 기반 세션
- 🛡️ 클라이언트 사이드 노출 방지
- 🔑 JWT 토큰 기반 인증
- ⚡ 세션 조작 방지

### 인증 시스템

이 애플리케이션은 JWT 기반의 보안 인증 시스템을 사용합니다:

1. **서버 사이드 인증**: 모든 인증 로직이 서버에서 처리됩니다
2. **HttpOnly 쿠키**: 브라우저의 개발자 도구로 접근할 수 없는 보안 쿠키
3. **JWT 토큰**: 안전한 세션 관리
4. **환경 변수 보호**: 민감한 정보는 서버에서만 접근 가능

### 보안 주의사항

⚠️ **중요**: 
- `ADMIN_PASSWORD`는 충분히 복잡하게 설정하세요
- `JWT_SECRET`은 최소 32자 이상의 무작위 문자열을 사용하세요
- 프로덕션 환경에서는 HTTPS를 필수로 사용하세요

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
