# tistory-gpt-publisher

Custom GPT의 자연어 명령으로 티스토리 포스팅 작업을 만들고, Vercel API와 GitHub Actions Worker를 통해 Playwright로 티스토리에 비공개 저장하는 자동화 스타터입니다.

## 핵심 구조

```txt
Custom GPT Actions
  -> Vercel Next.js API
  -> Postgres 작업 큐
  -> GitHub Actions repository_dispatch / schedule
  -> Playwright Tistory Publisher
  -> 기본 비공개 저장
```

> 티스토리 공식 Open API 글쓰기 기능 종료 이후를 전제로 합니다. 기본값은 `private`이며, 자동 공개 발행은 의도적으로 막아두었습니다.

## 빠른 시작

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Vercel 배포

1. 이 프로젝트를 GitHub에 올립니다.
2. Vercel에서 GitHub Repository를 Import합니다.
3. Environment Variables에 `.env.example` 항목을 입력합니다.
4. Build Command: `npm run build`
5. Output은 Next.js 기본값을 사용합니다.

## GitHub Secrets

Repository Settings → Secrets and variables → Actions → New repository secret

필수:

- `APP_BASE_URL`: Vercel 배포 URL
- `APP_API_KEY`: Custom GPT용 API 키
- `WORKER_SECRET`: Worker 인증 키
- `TISTORY_BLOG_NAME`
- `TISTORY_BLOG_URL`
- `TISTORY_COOKIE_JSON`
- `OPENAI_API_KEY` 선택
- `OPENAI_MODEL` 선택

## Custom GPT Actions 연결

`openapi/custom-gpt-actions.yaml` 파일의 `servers.url`을 Vercel 배포 URL로 바꾼 후 Custom GPT Actions에 등록합니다.

인증은 API Key 방식입니다.

Header:

```txt
x-api-key: <APP_API_KEY>
```

## 사용 예시

```txt
티스토리에 "건축 인허가 자동화" 주제로 글 하나 작성해서 비공개 저장해줘.
```

```txt
조경도면 지시선 작성법 주제로 5분 간격으로 3개 테스트 포스팅해줘. 모두 비공개로 해줘.
```

```txt
오늘은 티스토리 자동화, Playwright, GitHub Actions를 주제로 각각 하나씩 작성해줘.
```

## 티스토리 쿠키 준비

가장 안정적인 방식은 브라우저에서 티스토리에 로그인한 뒤 쿠키를 JSON으로 추출하여 GitHub Secret `TISTORY_COOKIE_JSON`에 저장하는 것입니다.

권장:

- 카카오 ID/PW를 코드에 저장하지 않기
- 2FA/캡차를 자동 우회하지 않기
- 쿠키 만료 시 `check-session` workflow로 감지
- 기본은 비공개 발행

## 주의

티스토리 UI 변경 시 `src/publisher/tistory.ts`의 selector를 보정해야 할 수 있습니다.
