import { NextRequest, NextResponse } from 'next/server';
import { deleteTemplateTask } from '@/lib/db/templates';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTemplateTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template task:', error);
    return NextResponse.json(
      { error: 'Failed to delete template task' },
      { status: 500 }
    );
  }
}


