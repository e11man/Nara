import { getAllEmployeesWithTasks, EmployeeWithTasks } from '@/lib/db/employees';
import { TaskItem } from './TaskItem';

async function getEmployees() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function EmployeeList() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8">
      {employees.length === 0 ? (
        <p className="text-gray-500">No employees have been onboarded yet.</p>
      ) : (
        employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))
      )}
    </div>
  );
}

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

