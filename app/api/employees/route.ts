import { NextRequest, NextResponse } from 'next/server';
import { getAllEmployeesWithTasks, createEmployee } from '@/lib/db/employees';
import { autoAssignDefaultTemplate } from '@/lib/db/templates';

export async function GET() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, department } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create the employee
    const employee = await createEmployee({ name, email, department });
    
    // Automatically assign default template tasks (if any)
    const autoAssignResult = await autoAssignDefaultTemplate(employee.id);
    
    return NextResponse.json({
      employee,
      autoAssigned: autoAssignResult ? {
        template: autoAssignResult.template.name,
        tasksCreated: autoAssignResult.tasksCreated
      } : null
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

