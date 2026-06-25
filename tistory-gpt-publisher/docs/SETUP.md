# 설치 및 운영 순서

## 1. GitHub Repository 생성

```bash
git init
git add .
git commit -m "init tistory gpt publisher"
git branch -M main
git remote add origin https://github.com/YOUR_ID/tistory-gpt-publisher.git
git push -u origin main
```

## 2. DB 생성

Supabase, Neon, Vercel Postgres 중 하나를 사용합니다.

```bash
npx prisma migrate deploy
```

로컬 개발 시:

```bash
npx prisma migrate dev --name init
```

## 3. Vercel 환경변수

- `DATABASE_URL`
- `APP_API_KEY`
- `WORKER_SECRET`
- `GITHUB_REPO`
- `GITHUB_PAT`

Vercel은 브라우저 실행용이 아니라 API/큐 관리용으로만 사용합니다.

## 4. GitHub Actions Secrets

- `APP_BASE_URL`
- `WORKER_SECRET`
- `TISTORY_BLOG_NAME`
- `TISTORY_BLOG_URL`
- `TISTORY_COOKIE_JSON`
- `OPENAI_API_KEY` 선택
- `OPENAI_MODEL` 선택

## 5. 티스토리 쿠키 추출

Chrome에서 티스토리 로그인 후 쿠키를 JSON 배열로 추출합니다. 확장 프로그램을 쓸 수도 있고, 개발자도구 Application 탭에서 직접 정리할 수도 있습니다.

주의:

- 계정 ID/PW를 저장하지 않습니다.
- 2FA/캡차 우회 코드는 넣지 않습니다.
- 쿠키가 만료되면 새 쿠키로 교체합니다.

## 6. Custom GPT Actions 등록

`openapi/custom-gpt-actions.yaml`의 서버 URL을 Vercel URL로 바꾸고 Actions에 등록합니다.

인증 방식:

```txt
API Key
Header name: x-api-key
Value: APP_API_KEY 값
```

## 7. 테스트 명령

```bash
curl -X POST "$APP_BASE_URL/api/posts/draft" \
  -H "x-api-key: $APP_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "topic":"티스토리 자동화 테스트",
    "title":"티스토리 자동화 테스트 글",
    "bodyMarkdown":"# 테스트\n\n이 글은 자동화 테스트입니다.",
    "tags":["티스토리","자동화","Playwright"],
    "publishMode":"private",
    "runNow":true
  }'
```
