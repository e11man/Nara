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

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
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
      setIsDeleting(false);
    }
  };

  return (
    <>
      <li className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          checked={task.isComplete}
          onChange={toggleComplete}
          disabled={isUpdating || isDeleting}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
        />
        <span className={`flex-1 ${task.isComplete ? "line-through text-gray-400" : "text-gray-800"}`}>
          {task.title}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            disabled={isDeleting}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </li>

      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}

