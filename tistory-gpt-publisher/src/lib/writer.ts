export type GenerateArticleInput = {
  instruction?: string | null;
  topic?: string | null;
  title?: string | null;
  category?: string | null;
  tags?: string[];
};

export async function generateArticle(input: GenerateArticleInput) {
  if (!process.env.OPENAI_API_KEY) {
    const title = input.title || input.topic || input.instruction || '티스토리 자동 포스팅 초안';
    const bodyMarkdown = `# ${title}\n\n이 글은 자동 포스팅 시스템 테스트용 초안입니다.\n\n## 작성 방향\n\n- 주제: ${input.topic || title}\n- 카테고리: ${input.category || '미지정'}\n- 태그: ${(input.tags || []).join(', ') || '없음'}\n\n## 본문\n\nCustom GPT 또는 OPENAI_API_KEY를 연결하면 이 영역에 실제 SEO 본문이 생성됩니다.\n\n## 마무리\n\n초기 운영 단계에서는 공개 발행보다 비공개 저장 후 검토를 권장합니다.`;
    return { title, bodyMarkdown };
  }

  const model = process.env.OPENAI_MODEL || 'gpt-5.1-mini';
  const prompt = `
너는 한국어 티스토리 블로그 SEO 작성자다.
아래 조건으로 블로그 글을 작성하라.
- 기본 톤: 실무자가 읽기 쉬운 친절한 설명체
- 과장 광고 금지
- 제목 1개와 Markdown 본문 생성
- 본문은 h2/h3 구조, 요약, 실무 팁, 주의사항 포함
- 공개 전 검토 가능한 초안 품질로 작성

명령: ${input.instruction || ''}
주제: ${input.topic || ''}
희망 제목: ${input.title || ''}
카테고리: ${input.category || ''}
태그: ${(input.tags || []).join(', ')}

JSON만 반환:
{"title":"...","bodyMarkdown":"..."}
`;

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: prompt
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI article generation failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const outputText = data.output_text || data.output?.flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('\n') || '';

  try {
    const parsed = JSON.parse(outputText);
    return {
      title: parsed.title || input.title || input.topic || '제목 없음',
      bodyMarkdown: parsed.bodyMarkdown || outputText
    };
  } catch {
    return {
      title: input.title || input.topic || '제목 없음',
      bodyMarkdown: outputText
    };
  }
}
