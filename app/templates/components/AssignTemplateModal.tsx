'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Template = {
  id: string;
  name: string;
  description: string | null;
  tasks: { id: string; title: string }[];
};

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string | null;
};

type AssignTemplateModalProps = {
  template: Template;
  onClose: () => void;
};

export function AssignTemplateModal({ template, onClose }: AssignTemplateModalProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch('/api/employees');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employees');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/templates/${template.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: selectedEmployeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign template');
      }

      router.refresh();
      alert(`Template "${template.name}" assigned successfully! ${template.tasks.length} tasks created.`);
      onClose();
    } catch (err) {
      setError('Failed to assign template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Assign Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            This will create {template.tasks.length} task{template.tasks.length !== 1 ? 's' : ''} for the selected employee.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee *
            </label>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading employees...</p>
            ) : (
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                required
              >
                <option value="">-- Select an employee --</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department || 'No dept'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 font-medium"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


