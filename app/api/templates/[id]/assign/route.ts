import { NextRequest, NextResponse } from 'next/server';
import { assignTemplateToEmployee } from '@/lib/db/templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const result = await assignTemplateToEmployee(templateId, employeeId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error assigning template:', error);
    return NextResponse.json(
      { error: 'Failed to assign template' },
      { status: 500 }
    );
  }
}


