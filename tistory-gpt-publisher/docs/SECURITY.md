# Security Notes

## 하지 않을 것

- 카카오 계정 ID/PW를 코드나 Secret에 저장하지 않음
- 캡차/2FA 우회 자동화 구현하지 않음
- 티스토리 비공식 내부 API를 기본 발행 방식으로 쓰지 않음
- 기본 공개 발행 금지

## 할 것

- `APP_API_KEY`로 Custom GPT API 호출 보호
- `WORKER_SECRET`으로 GitHub Actions Worker 호출 보호
- GitHub Secrets에 쿠키 저장
- 로그에 쿠키/토큰 출력 금지
- 실패 시 재시도 횟수 제한

## 운영 리스크

티스토리 UI가 변경되면 Playwright selector가 깨질 수 있습니다. 그래서 발행 모듈은 `src/publisher/tistory.ts`에 집중시켜 유지보수하도록 설계했습니다.
