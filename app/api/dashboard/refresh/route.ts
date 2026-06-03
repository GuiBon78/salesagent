import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || '';

function isSameOriginDashboardRequest(req: NextRequest) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  const fetchSite = req.headers.get('sec-fetch-site');

  if (fetchSite === 'same-origin') return true;
  if (!origin || !host) return false;

  return origin === `https://${host}` || origin === `http://${host}`;
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-internal-api-key') || '';
  const hasValidKey = Boolean(INTERNAL_API_KEY) && key === INTERNAL_API_KEY;

  // The Vercel deployment is already protected. Accept same-origin browser
  // refreshes so a stale/missing NEXT_PUBLIC key cannot break the dashboard.
  if (!hasValidKey && !isSameOriginDashboardRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'vercel-dashboard', triggeredAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'n8n error', detail: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Use POST to trigger Jordan' });
}
