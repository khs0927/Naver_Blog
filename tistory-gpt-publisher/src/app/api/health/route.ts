export async function GET() {
  return Response.json({ ok: true, service: 'tistory-gpt-publisher', time: new Date().toISOString() });
}
