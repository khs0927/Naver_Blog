# Architecture

## 원칙

1. 공식 API 글쓰기는 사용하지 않는다.
2. 카카오 계정 ID/PW 자동 로그인은 사용하지 않는다.
3. 기본 발행은 비공개다.
4. Vercel은 API/큐/상태 관리만 담당한다.
5. 실제 브라우저 자동화는 GitHub Actions Worker가 담당한다.

## 흐름

```txt
Custom GPT -> POST /api/posts/draft
           -> Post + Job 생성
           -> /api/github/dispatch
           -> GitHub Actions publish.yml
           -> /api/jobs/claim
           -> Playwright Tistory Publisher
           -> /api/jobs/{id}/complete or fail
```

## 장애 대응

- 쿠키 만료: `check-session.yml` 실패
- UI 변경: `src/publisher/tistory.ts` selector 보정
- 글 생성 실패: Custom GPT가 본문을 넘기거나 OPENAI_API_KEY 점검
- 발행 실패: `/api/jobs/{id}/retry`

## 운영 추천

초기 2주:

- 전부 비공개 저장
- 하루 1~3개 이하
- 카테고리/태그 수동 확인
- 중복글 생성 여부 확인

안정화 후:

- 승인형 공개 발행 추가
- 주제 후보 자동 생성
- SERP/검색량 기반 주제 필터링
