import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const startTime = Date.now();

/**
 * GET /api/healthz
 * Lightweight health check: DB read ping + process uptime.
 * Returns 200 { status: 'ok' } or 503 { status: 'degraded' }.
 */
export async function GET() {
  const checks: Record<string, string> = {};
  let allOk = true;

  // ── Database READ probe ───────────────────────────────────────────────
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : String(err)}`;
    allOk = false;
  }

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      checks,
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  );
}

/**
 * POST /api/healthz
 * Body: { probe: "write" }
 * Runs a zero-effect UPDATE (affects 0 rows) to verify the DB write connection.
 * Returns 200 { status: 'ok', write: 'ok' } or 503.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.probe !== 'write') {
      return NextResponse.json({ error: 'Expected { probe: "write" }' }, { status: 400 });
    }

    // Safe write: UPDATE 0 rows — no side effects, but exercises the write path
    await prisma.user.updateMany({
      where: { id: '__health_probe_nonexistent__' },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ status: 'ok', write: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', write: `error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 503 }
    );
  }
}

// Never cache health checks
export const dynamic = 'force-dynamic';
