import { NextRequest, NextResponse } from 'next/server';
import { setDefaultTemplate } from '@/lib/db/templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await setDefaultTemplate(id);
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error setting default template:', error);
    return NextResponse.json(
      { error: 'Failed to set default template' },
      { status: 500 }
    );
  }
}

