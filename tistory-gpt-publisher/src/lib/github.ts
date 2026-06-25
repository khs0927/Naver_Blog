export async function dispatchPublishJob(jobId: string) {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_PAT;

  if (!repo || !token) {
    console.warn('GITHUB_REPO or GITHUB_PAT is missing. Skipping repository_dispatch.');
    return { dispatched: false, reason: 'missing_github_config' };
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'publish-post',
      client_payload: { jobId }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub dispatch failed: ${res.status} ${text}`);
  }

  return { dispatched: true };
}
