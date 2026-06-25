# 환경변수 / Secrets 체크리스트

아래 값들이 준비되면 Vercel 배포, GitHub Actions Worker, Custom GPT Actions 연결까지 진행할 수 있습니다.

## 1. Vercel Environment Variables

Vercel Project Settings → Environment Variables에 입력합니다.

```txt
DATABASE_URL=
APP_API_KEY=
WORKER_SECRET=
GITHUB_REPO=khs0927/Naver_Blog
GITHUB_PAT=
TISTORY_DEFAULT_VISIBILITY=private
```

선택:

```txt
TISTORY_DEFAULT_CATEGORY=
```

## 2. GitHub Actions Secrets

GitHub Repository → Settings → Secrets and variables → Actions에 입력합니다.

### Vercel 자동 배포용

```txt
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

### 티스토리 Worker용

```txt
APP_BASE_URL=
APP_API_KEY=
WORKER_SECRET=
TISTORY_BLOG_NAME=
TISTORY_BLOG_URL=
TISTORY_COOKIE_JSON=
TISTORY_DEFAULT_CATEGORY=
```

## 3. 각 값의 의미

### DATABASE_URL

Postgres 연결 문자열입니다.

```txt
postgresql://user:password@host:5432/db?schema=public
```

### APP_API_KEY

Custom GPT가 Vercel API를 호출할 때 쓰는 인증키입니다.

예시:

```txt
tistory_gpt_change_this_to_long_random_text
```

### WORKER_SECRET

GitHub Actions Worker가 Vercel API를 호출할 때 쓰는 인증키입니다.

예시:

```txt
tistory_worker_change_this_to_long_random_text
```

### GITHUB_PAT

Vercel API가 GitHub Actions의 `repository_dispatch`를 실행하기 위한 GitHub Personal Access Token입니다.

필요 권한:

- Repository access: `khs0927/Naver_Blog`
- Actions workflow dispatch/repository dispatch가 가능한 권한

### APP_BASE_URL

Vercel 배포 후 생성되는 URL입니다.

예시:

```txt
https://your-project.vercel.app
```

### TISTORY_BLOG_NAME

티스토리 주소 앞부분입니다.

예시:

```txt
myblog
```

### TISTORY_BLOG_URL

티스토리 전체 주소입니다.

예시:

```txt
https://myblog.tistory.com
```

### TISTORY_COOKIE_JSON

티스토리에 로그인된 브라우저 쿠키 JSON 배열입니다.

주의:

- 카카오 ID/PW를 저장하지 않습니다.
- 2FA나 캡차 우회 코드는 사용하지 않습니다.
- 쿠키가 만료되면 새 쿠키로 교체합니다.

## 4. 사용자가 ChatGPT에 전달하면 되는 값

아래 값들을 준비해서 전달하면 다음 단계 진행이 가능합니다.

```txt
DATABASE_URL=
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
TISTORY_BLOG_NAME=
TISTORY_BLOG_URL=
TISTORY_COOKIE_JSON=
```

APP_API_KEY와 WORKER_SECRET은 임의의 긴 랜덤 문자열로 생성해서 사용하면 됩니다.
