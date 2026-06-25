async function main() {
  const base = process.env.APP_BASE_URL;
  const secret = process.env.WORKER_SECRET;
  if (!base) throw new Error('APP_BASE_URL is not configured');
  if (!secret) throw new Error('WORKER_SECRET is not configured');

  const res = await fetch(`${base}/api/schedules/run-due`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-worker-secret': secret
    },
    body: JSON.stringify({})
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`run-due schedules failed: ${res.status} ${text}`);
  }

  console.log(await res.json());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
