# 설치 및 운영 순서

## 1. GitHub 저장소 상태

현재 프로젝트는 `khs0927/Naver_Blog` 저장소의 아래 폴더에 있습니다.

```txt
tistory-gpt-publisher/
```

Vercel Import 시 Root Directory를 반드시 위 폴더로 지정합니다.

## 2. DB 생성

Supabase, Neon, Vercel Postgres 중 하나를 사용합니다.

```bash
cd tistory-gpt-publisher
npx prisma migrate deploy
```

로컬 개발 시:

```bash
cd tistory-gpt-publisher
npx prisma migrate dev --name init
```

## 3. Vercel 환경변수

- `DATABASE_URL`
- `APP_API_KEY`
- `WORKER_SECRET`
- `GITHUB_REPO`
- `GITHUB_PAT`

Vercel은 브라우저 실행용이 아니라 API와 작업 큐 관리용으로만 사용합니다.

## 4. GitHub Actions Secrets

- `APP_BASE_URL`
- `WORKER_SECRET`
- `TISTORY_BLOG_NAME`
- `TISTORY_BLOG_URL`
- `TISTORY_COOKIE_JSON`
- `OPENAI_API_KEY` 선택
- `OPENAI_MODEL` 선택

## 5. 티스토리 쿠키 추출

Chrome에서 티스토리 로그인 후 쿠키를 JSON 배열로 추출합니다.

주의:

- 계정 ID와 비밀번호를 저장하지 않습니다.
- 2FA와 캡차 우회 코드는 넣지 않습니다.
- 쿠키가 만료되면 새 쿠키로 교체합니다.

## 6. Custom GPT Actions 등록

`openapi/custom-gpt-actions.yaml`의 서버 URL을 Vercel URL로 바꾸고 Actions에 등록합니다.

인증 방식:

```txt
API Key
Header name: x-api-key
Value: APP_API_KEY 값
```

## 7. 테스트 요청 예시

`/api/posts/draft`로 비공개 발행 작업을 만들 수 있습니다. 본문은 `bodyMarkdown`으로 전달합니다.
