export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    {
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local',
      deploymentUrl: process.env.VERCEL_URL || null,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
