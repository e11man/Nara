'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.department?.toLowerCase().includes(query)
    );
  });

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee.id);
    setSearchQuery(employee.name);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    // Clear selection if user is typing
    if (selectedEmployee && e.target.value !== selectedEmployee.name) {
      setSelectedEmployee(null);
      setSelectedEmployeeId('');
    }
  };

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
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
          >
            <X className="w-5 h-5" />
          </Button>
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
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search by name, email, or department..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  />
                </div>
                
                {isDropdownOpen && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() => handleSelectEmployee(employee)}
                        className={`w-full text-left px-4 py-2 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors ${
                          selectedEmployeeId === employee.id ? 'bg-purple-100' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">
                              {employee.email} • {employee.department || 'No department'}
                            </div>
                          </div>
                          {selectedEmployeeId === employee.id && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isDropdownOpen && searchQuery && filteredEmployees.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                    <p className="text-sm text-gray-500 text-center">
                      No employees found matching "{searchQuery}"
                    </p>
                  </div>
                )}

                {selectedEmployee && (
                  <div className="mt-2 p-3 bg-purple-50 rounded-md border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Selected:</div>
                        <div className="text-sm text-gray-700">{selectedEmployee.name}</div>
                        <div className="text-xs text-gray-500">{selectedEmployee.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmployee(null);
                          setSelectedEmployeeId('');
                          setSearchQuery('');
                        }}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


