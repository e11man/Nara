import { Suspense } from 'react';
import { EmployeesTable } from './components/EmployeesTable';
import { getAllEmployeesWithTasks, EmployeeWithTasks } from '@/lib/db/employees';
import { SearchBar } from '../components/SearchBar';

export const dynamic = 'force-dynamic';

async function getEmployees() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [] as EmployeeWithTasks[];
  }
}

async function EmployeesContent({ query }: { query: string }) {
  const allEmployees = await getEmployees();
  
  // Server-side filtering
  const employees = query
    ? allEmployees.filter((emp: EmployeeWithTasks) => 
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()) ||
        emp.department?.toLowerCase().includes(query.toLowerCase())
      )
    : allEmployees;

  if (employees.length === 0 && query) {
    return <p className="text-gray-500 text-center py-8">No employees found matching "{query}"</p>;
  }

  return <EmployeesTable employees={employees} />;
}

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <SearchBar placeholder="Search employees..." />
      </div>
      
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      }>
        <EmployeesContent query={query} />
      </Suspense>
    </div>
  );
}