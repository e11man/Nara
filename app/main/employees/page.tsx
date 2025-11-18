import { EmployeesTable } from './components/EmployeesTable';

async function getEmployees() {
  const res = await fetch('http://localhost:3000/api/employees', {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  return res.json();
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Employee
        </button>
      </div>
      
      <EmployeesTable employees={employees} />
    </div>
  );
}