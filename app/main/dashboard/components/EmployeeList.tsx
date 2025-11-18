import { getAllEmployeesWithTasks, EmployeeWithTasks } from '@/lib/db/employees';
import { TaskItem } from './TaskItem';
import { Progress } from '@/components/ui/progress';

async function getEmployees() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [] as EmployeeWithTasks[];
  }
}

export async function EmployeeList({ query }: { query: string }) {
  const allEmployees = await getEmployees();
  
  // Server-side filtering
  const employees = query
    ? allEmployees.filter((emp: EmployeeWithTasks) => 
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()) ||
        emp.department?.toLowerCase().includes(query.toLowerCase()) ||
        emp.tasks.some((task) => task.title.toLowerCase().includes(query.toLowerCase()))
      )
    : allEmployees;

  return (
    <div className="space-y-8">
      {employees.length === 0 ? (
        <p className="text-gray-500">
          {query ? `No employees found matching "${query}"` : 'No employees have been onboarded yet.'}
        </p>
      ) : (
        employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))
      )}
    </div>
  );
}

function EmployeeCard({ employee }: { employee: EmployeeWithTasks }) {
  const completedTasks = employee.tasks.filter(t => t.isComplete).length;
  const totalTasks = employee.tasks.length;
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold text-blue-800">{employee.name}</h2>
      <p className="text-sm text-gray-600">Department: {employee.department}</p>
      <p className="text-sm text-gray-600">Email: {employee.email}</p>
      
      <div className="mt-3 mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Progress: {completedTasks}/{totalTasks}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
        <Progress value={completedTasks} max={totalTasks} />
      </div>
      
      <ul className="space-y-1 mt-3">
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

