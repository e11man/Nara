'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateTemplateModal } from './CreateTemplateModal';
import { AddTemplateTaskModal } from './AddTemplateTaskModal';
import { AssignTemplateModal } from './AssignTemplateModal';

type Template = {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  tasks: {
    id: string;
    title: string;
    description: string | null;
  }[];
};

export function TemplatesList({ templates: initialTemplates }: { templates: Template[] }) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplateForTask, setSelectedTemplateForTask] = useState<string | null>(null);
  const [selectedTemplateForAssign, setSelectedTemplateForAssign] = useState<Template | null>(null);

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/template-tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleSetDefault = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/set-default`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to set default template');
      }

      router.refresh();
      alert('Template set as default! New employees will automatically get these tasks.');
    } catch (error) {
      console.error('Error setting default template:', error);
      alert('Failed to set default template');
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          + Create New Template
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialTemplates.map((template) => (
          <div key={template.id} className="border rounded-lg p-6 bg-white shadow-sm relative">
            {template.isDefault && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  ⚙️ AUTO-ASSIGN
                </span>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="pr-20">
                <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Tasks ({template.tasks.length})
                </h4>
                <button
                  onClick={() => setSelectedTemplateForTask(template.id)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add Task
                </button>
              </div>
              
              {template.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks yet</p>
              ) : (
                <ul className="space-y-2">
                  {template.tasks.map((task) => (
                    <li key={task.id} className="flex items-start justify-between text-sm">
                      <span className="text-gray-800">{task.title}</span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs text-red-600 hover:text-red-800 ml-2"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t">
              {!template.isDefault && (
                <button
                  onClick={() => handleSetDefault(template.id)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                >
                  ⚙️ Set as Auto-Assign Template
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTemplateForAssign(template)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
                >
                  Assign to Employee
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {initialTemplates.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No templates yet. Create your first template to get started!
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTemplateModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedTemplateForTask && (
        <AddTemplateTaskModal
          templateId={selectedTemplateForTask}
          onClose={() => setSelectedTemplateForTask(null)}
        />
      )}

      {selectedTemplateForAssign && (
        <AssignTemplateModal
          template={selectedTemplateForAssign}
          onClose={() => setSelectedTemplateForAssign(null)}
        />
      )}
    </>
  );
}


