# 원격 설정 가능 범위

현재 ChatGPT 연결 도구로 가능한 작업과 불가능한 작업을 정리합니다.

## 직접 완료 가능한 작업

- GitHub 파일 생성, 수정, 삭제
- GitHub Pull Request 생성 및 병합
- GitHub Actions workflow 작성
- Vercel 배포용 workflow 코드 작성
- 프로젝트 문서화

## 직접 불가능한 작업

현재 연결 도구에는 다음 기능이 없습니다.

- Vercel 프로젝트 원격 생성
- Vercel Environment Variables 원격 입력
- GitHub Actions Secrets 원격 입력
- Vercel Postgres DB 원격 생성
- 티스토리 로그인 쿠키 원격 추출

## 이유

위 항목들은 계정 보안 영역입니다. 현재 사용 가능한 Vercel 도구는 프로젝트 조회, 배포 조회, 로그 조회, 문서 검색, 현재 프로젝트 배포 안내 수준이며 프로젝트 생성 API는 제공하지 않습니다.

GitHub 도구도 repository file, pull request, workflow 조회 및 병합은 가능하지만 repository secrets 생성 기능은 제공하지 않습니다.

## 사용자가 직접 해야 하는 최소 작업

1. Vercel Dashboard에서 프로젝트 생성
2. GitHub Repository Secrets 입력
3. Vercel Environment Variables 입력
4. Postgres DATABASE_URL 생성
5. Tistory Cookie JSON 입력

## 프로젝트 생성 설정

```txt
Repository: khs0927/Naver_Blog
Root Directory: tistory-gpt-publisher
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
```

## GitHub Secrets

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
APP_BASE_URL
APP_API_KEY
WORKER_SECRET
TISTORY_BLOG_NAME
TISTORY_BLOG_URL
TISTORY_COOKIE_JSON
TISTORY_DEFAULT_CATEGORY
```

## Vercel Environment Variables

```txt
DATABASE_URL
APP_API_KEY
WORKER_SECRET
GITHUB_REPO
GITHUB_PAT
TISTORY_DEFAULT_VISIBILITY
TISTORY_DEFAULT_CATEGORY
```

## 비밀값 주의

Vercel Token, GitHub PAT, Database URL, Tistory Cookie JSON은 코드나 문서에 저장하지 않습니다.
