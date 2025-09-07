# Food Sequence +12334

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
