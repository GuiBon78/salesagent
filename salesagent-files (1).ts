import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

export async function POST(req: NextRequest) {
  // Vérification clé interne
  const key = req.headers.get('x-internal-api-key');
  if (key !== INTERNAL_API_KEY) {
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
