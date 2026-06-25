import { NextRequest } from 'next/server';
import { requireApiKey } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const seed = body.seed || '티스토리 블로그 자동화';
  const count = Math.min(Number(body.count || 5), 20);

  const topics = Array.from({ length: count }, (_, i) => ({
    title: `${seed} 실무 가이드 ${i + 1}`,
    keyword: seed,
    reason: '초기 MVP용 주제 후보입니다. OPENAI_API_KEY 연결 후 실제 검색 의도 기반 후보 생성으로 확장하세요.'
  }));

  return Response.json({ ok: true, topics });
}
