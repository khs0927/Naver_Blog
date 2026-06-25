# 데이터베이스 설정 가이드

이 프로젝트는 Custom GPT 요청을 즉시 티스토리에 올리지 않고, 먼저 DB에 작업으로 저장한 뒤 GitHub Actions Worker가 순차 처리합니다.

## 왜 DB가 필요한가

1. Custom GPT와 웹 API의 타임아웃을 피합니다.
2. 티스토리 브라우저 자동화 작업을 큐로 순차 처리합니다.
3. 반복 예약과 실패 재시도를 기록합니다.
4. 세션 만료, 셀렉터 변경, 발행 실패 로그를 보관합니다.

## DB에 저장되는 데이터

Prisma schema 기준으로 다음 테이블이 사용됩니다.

### Post

글 제목, 주제, 본문, 태그, 카테고리, 발행 상태를 저장합니다.

상태 예시:

- `QUEUED`
- `RUNNING`
- `DRAFTED`
- `PUBLISHED`
- `FAILED`

### Job

실제 발행 작업 큐입니다. GitHub Actions Worker가 이 테이블에서 실행할 작업을 가져갑니다.

주요 필드:

- `runAfter`
- `attempts`
- `maxAttempts`
- `lastError`

### Schedule

반복 포스팅 예약을 저장합니다.

예시:

- 5분 간격 3개 테스트 발행
- 매일 1개씩 비공개 저장

### RunLog

실행 로그와 오류 내용을 저장합니다.

## 추천 DB

처음에는 다음 중 하나를 추천합니다.

1. Vercel Postgres / Vercel Marketplace DB
2. Neon Postgres
3. Supabase Postgres

중요한 것은 최종적으로 아래 형식의 연결 문자열이 필요하다는 점입니다.

```txt
DATABASE_URL=postgresql://user:password@host:5432/db?schema=public
```

## Vercel에서 연결할 값

Vercel Project Settings → Environment Variables에 아래 값을 추가합니다.

```txt
DATABASE_URL=postgresql://...
```

Production, Preview, Development 모두 같은 값을 넣어도 됩니다. 초기 MVP 단계에서는 Production만 먼저 넣어도 됩니다.

## Prisma 마이그레이션

로컬 또는 GitHub Codespaces에서 실행:

```bash
cd tistory-gpt-publisher
npm install
npx prisma generate
npx prisma migrate deploy
```

초기 개발용으로 새 migration을 만들 때:

```bash
cd tistory-gpt-publisher
npx prisma migrate dev --name init
```

## 확인 방법

DB 연결 후 아래 API가 정상 응답해야 합니다.

```txt
GET /api/health
```

그다음 Custom GPT 또는 curl로 `/api/posts/draft`에 요청하면 `Post`와 `Job`이 생성됩니다.

## 현재 필요한 사용자 제공값

```txt
DATABASE_URL
```

이 값이 준비되면 Vercel 환경변수와 GitHub Actions Secrets 설정 단계로 넘어갑니다.
