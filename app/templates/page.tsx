import { TemplatesList } from './components/TemplatesList';
import { getAllTemplatesWithTasks } from '@/lib/db/templates';

async function getTemplates() {
  try {
    const templates = await getAllTemplatesWithTasks();
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Templates</h1>
      </div>
      
      <p className="text-gray-600 mb-6">
        Create reusable task templates for common onboarding scenarios (e.g., IT Setup, HR Orientation).
        Assign templates to employees to automatically create all associated tasks.
      </p>
      
      <TemplatesList templates={templates} />
    </div>
  );
}

