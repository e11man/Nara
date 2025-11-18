'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
};

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleComplete = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isComplete: !task.isComplete }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className="flex items-center gap-3 py-1">
      <input
        type="checkbox"
        checked={task.isComplete}
        onChange={toggleComplete}
        disabled={isUpdating}
        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
      />
      <span className={task.isComplete ? "line-through text-gray-400" : "text-gray-800"}>
        {task.title}
      </span>
    </li>
  );
}

