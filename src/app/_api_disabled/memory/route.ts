import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://krhhfykgnznkesnarbzd.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaGhmeWtnbnpua2VzbmFyYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwMDc2NSwiZXhwIjoyMDkwMDc2NzY1fQ.s1VOymzCmM2VMhucckC8WXuQ1OIXtfS7NevMMockLAg';

// GET /api/memory?agent_id=xxx&type=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agent_id = searchParams.get('agent_id');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit') || '10';

  if (!agent_id) {
    return NextResponse.json({ error: 'agent_id is required' }, { status: 400 });
  }

  try {
    let query = `agent_id=eq.${agent_id}&order=created_at.desc&limit=${limit}`;
    if (type) {
      query += `&type=eq.${type}`;
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/agent_memories?${query}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: 'Failed to fetch memories', details: error }, { status: 500 });
    }

    const memories = await response.json();
    return NextResponse.json({ memories });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

// POST /api/memory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent_id, type, content, embedding } = body;

    if (!agent_id || !type || !content) {
      return NextResponse.json({ error: 'agent_id, type, and content are required' }, { status: 400 });
    }

    const memoryProphet: Record<string, unknown> = {
      agent_id,
      type,
      content,
    };

    if (embedding) {
      memoryProphet.embedding = embedding;
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/agent_memories`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(memoryProphet),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: 'Failed to save memory', details: error }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, memory: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/memory?id=xxx
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/agent_memories?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: 'Failed to delete memory', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}