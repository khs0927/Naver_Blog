export type GenerateArticleInput = {
  instruction?: string | null;
  topic?: string | null;
  title?: string | null;
  category?: string | null;
  tags?: string[];
};

export async function generateArticle(input: GenerateArticleInput) {
  const title = input.title || input.topic || input.instruction || '티스토리 자동 포스팅 초안';
  const bodyMarkdown = `# ${title}\n\n이 글은 자동 포스팅 시스템 테스트용 초안입니다.\n\n## 작성 방향\n\n- 주제: ${input.topic || title}\n- 카테고리: ${input.category || '미지정'}\n- 태그: ${(input.tags || []).join(', ') || '없음'}\n\n## 본문\n\nCustom GPT에서 bodyMarkdown을 넘기면 실제 본문이 저장됩니다.\n\n## 마무리\n\n초기 운영 단계에서는 공개 발행보다 비공개 저장 후 검토를 권장합니다.`;
  return { title, bodyMarkdown };
}
