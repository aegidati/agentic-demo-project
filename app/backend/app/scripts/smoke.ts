import { buildApp } from '../src/main';

async function run(): Promise<void> {
  const app = buildApp();

  try {
    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    const body = response.json();
    const ok = response.statusCode === 200 && body?.status === 'ok';

    if (!ok) {
      throw new Error(`Smoke check failed: status=${response.statusCode}, body=${JSON.stringify(body)}`);
    }

    console.log('Smoke check passed: GET /health -> {"status":"ok"}');
  } finally {
    await app.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
