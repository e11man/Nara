'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const toggleComplete = async (taskId: string, currentStatus: boolean) => {
    setUpdatingTaskId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isComplete: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500 py-2">No tasks assigned</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <li key={task.id} className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.isComplete}
            onChange={() => toggleComplete(task.id, task.isComplete)}
            disabled={updatingTaskId === task.id}
            className="w-4 h-4 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
          />
          <div className="flex-1">
            <p className={`text-sm ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1">{task.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

