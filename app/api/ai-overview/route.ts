import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllEmployeesWithTasks } from '@/lib/db/employees';

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Fetch all employees with their tasks
    const employees = await getAllEmployeesWithTasks();

    if (employees.length === 0) {
      return NextResponse.json({
        overview: "No employees found. Add employees to get started with onboarding!"
      });
    }

    // Format data for AI analysis
    const employeeData = employees.map(emp => ({
      name: emp.name,
      department: emp.department || 'Not assigned',
      onboarded: emp.onboarded,
      tasks: emp.tasks.map(task => ({
        title: task.title,
        completed: task.isComplete
      }))
    }));

    // Create AI prompt
    const prompt = `You are an HR onboarding assistant analyzing employee progress. Here is the current status of all employees:

${JSON.stringify(employeeData, null, 2)}

Please provide a concise, actionable overview of the onboarding status. For each employee with incomplete tasks:
1. Address them by name
2. List their specific pending tasks
3. Provide priority recommendations

Keep the tone professional but friendly. Format your response in clear paragraphs, not bullet points. Focus on what needs to be done next.`;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Generate AI overview
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const overview = response.text();

    return NextResponse.json({ overview });

  } catch (error: any) {
    console.error('Error generating AI overview:', error);
    
    // Provide more helpful error messages
    if (error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GEMINI_API_KEY in .env' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to generate AI overview: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

