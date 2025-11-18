import { EmployeesTable } from './components/EmployeesTable';
import { getAllEmployeesWithTasks } from '@/lib/db/employees';

async function getEmployees() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
      </div>
      
      <EmployeesTable employees={employees} />
    </div>
  );
}