'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Settings, UserPlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialTemplates.map((template) => (
          <div key={template.id} className="border rounded-lg p-6 bg-white shadow-sm relative">
            {template.isDefault && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  AUTO-ASSIGN
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
                <Button
                  onClick={() => setSelectedTemplateForTask(template.id)}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Task
                </Button>
              </div>
              
              {template.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks yet</p>
              ) : (
                <ul className="space-y-2">
                  {template.tasks.map((task) => (
                    <li key={task.id} className="flex items-start justify-between text-sm">
                      <span className="text-gray-800">{task.title}</span>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        variant="destructive"
                        size="sm"
                        className="h-6 text-xs ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t">
              {!template.isDefault && (
                <Button
                  onClick={() => handleSetDefault(template.id)}
                  className="w-full"
                  variant="secondary"
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Set as Auto-Assign Template
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedTemplateForAssign(template)}
                  className="flex-1"
                  variant="secondary"
                  size="sm"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign to Employee
                </Button>
                <Button
                  onClick={() => handleDeleteTemplate(template.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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


