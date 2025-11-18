'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditTaskModal } from './EditTaskModal';

type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeletingTaskId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500 py-2">No tasks assigned</p>;
  }

  return (
    <>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={() => toggleComplete(task.id, task.isComplete)}
              disabled={updatingTaskId === task.id || deletingTaskId === task.id}
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
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTask(task)}
                disabled={deletingTaskId === task.id}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                disabled={deletingTaskId === task.id}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
              >
                {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}

