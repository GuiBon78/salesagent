import { NextResponse } from 'next/server';

// Stockage en mémoire (reset à chaque cold start)
// Pour persister, utiliser KV, Redis ou une DB
let latestData: any = null;
let lastUpdated: string | null = null;

export async function GET() {
  if (!latestData) {
    return NextResponse.json(
      { error: 'Aucune donnée disponible. Cliquez sur Refresh.' },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: latestData, lastUpdated }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    latestData = body;
    lastUpdated = new Date().toISOString();
    return NextResponse.json({ success: true, lastUpdated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
