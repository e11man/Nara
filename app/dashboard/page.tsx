import { EmployeeWithTasks } from '@/lib/db/employees';
import { TaskItem } from './components/TaskItem';

async function getEmployees(): Promise<EmployeeWithTasks[]> {
  const res = await fetch('http://localhost:3000/api/employees', {
    cache: 'no-store' // Always get fresh data
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  return res.json();
}

export default async function DashboardPage() {
  const employees = await getEmployees();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">HR Onboarding Dashboard</h1>
      
      {/* TODO: Placeholder for the AI Overview Button in Step 3 */}
      <div className="mb-8">
        <button 
          className="bg-purple-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-purple-700"
        >
          Generate AI Overview (Coming Soon)
        </button>
      </div>

      <div className="space-y-8">
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees have been onboarded yet.</p>
        ) : (
          // 2. Map through the data and display each employee
          employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))
        )}
      </div>
    </div>
  );
}

// 3. Simple component to display employee and their tasks
function EmployeeCard({ employee }: { employee: EmployeeWithTasks }) {
  const incompleteTasks = employee.tasks.filter(t => !t.isComplete).length;
  
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold text-blue-800">{employee.name}</h2>
      <p className="text-sm text-gray-600">Department: {employee.department}</p>
      <p className="text-sm text-gray-600">Email: {employee.email}</p>
      
      <h3 className="text-md font-medium mt-3 mb-2">
        Pending Tasks: <span className={incompleteTasks > 0 ? "text-red-600" : "text-green-600"}>
          {incompleteTasks}
        </span>
      </h3>
      
      <ul className="space-y-1">
        {employee.tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
        {employee.tasks.length === 0 && (
          <li className="text-sm text-gray-500">No tasks assigned yet</li>
        )}
      </ul>

    </div>
  );
}