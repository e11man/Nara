import { NextRequest, NextResponse } from 'next/server';
import { createTemplateTask } from '@/lib/db/templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const task = await createTemplateTask({
      title,
      description,
      templateId: id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating template task:', error);
    return NextResponse.json(
      { error: 'Failed to create template task' },
      { status: 500 }
    );
  }
}


