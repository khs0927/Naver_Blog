import { generateArticle } from '../src/lib/writer';
import { markdownToHtml } from '../src/lib/markdown';
import { publishToTistory } from '../src/publisher/tistory';

function argValue(name: string) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function api(path: string, init?: RequestInit) {
  const base = process.env.APP_BASE_URL;
  const secret = process.env.WORKER_SECRET;
  if (!base) throw new Error('APP_BASE_URL is not configured');
  if (!secret) throw new Error('WORKER_SECRET is not configured');

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-worker-secret': secret,
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  const jobId = argValue('--job-id') || process.env.JOB_ID;
  const claim = await api('/api/jobs/claim', {
    method: 'POST',
    body: JSON.stringify({ jobId })
  });

  const job = claim.job;
  if (!job) {
    console.log('No due job found.');
    return;
  }

  try {
    const post = job.post;
    let title = post.title;
    let bodyMarkdown = post.bodyMarkdown;

    if (!bodyMarkdown) {
      const generated = await generateArticle({
        instruction: post.topic,
        topic: post.topic,
        title: post.title,
        category: post.category,
        tags: post.tags
      });
      title = generated.title;
      bodyMarkdown = generated.bodyMarkdown;
    }

    const result = await publishToTistory({
      title,
      bodyMarkdown,
      bodyHtml: post.bodyHtml || markdownToHtml(bodyMarkdown || ''),
      category: post.category,
      tags: post.tags,
      publishMode: post.publishMode as 'PRIVATE' | 'PUBLIC' | 'DRAFT'
    });

    await api(`/api/jobs/${job.id}/complete`, {
      method: 'POST',
      body: JSON.stringify(result)
    });

    console.log(`Published job ${job.id}:`, result);
  } catch (error: any) {
    console.error(error);
    await api(`/api/jobs/${job.id}/fail`, {
      method: 'POST',
      body: JSON.stringify({ error: error?.message || String(error) })
    });
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
