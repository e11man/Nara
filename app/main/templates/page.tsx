import { Suspense } from 'react';
import { TemplatesList } from './components/TemplatesList';
import { getAllTemplatesWithTasks } from '@/lib/db/templates';
import { SearchBar } from '../components/SearchBar';

export const dynamic = 'force-dynamic';

type TemplateWithTasks = Awaited<ReturnType<typeof getAllTemplatesWithTasks>>[number];

async function getTemplates() {
  try {
    const templates = await getAllTemplatesWithTasks();
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [] as Awaited<ReturnType<typeof getAllTemplatesWithTasks>>;
  }
}

async function TemplatesContent({ query }: { query: string }) {
  const allTemplates = await getTemplates();
  
  // Server-side filtering
  const templates = query
    ? allTemplates.filter((template: TemplateWithTasks) => 
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description?.toLowerCase().includes(query.toLowerCase()) ||
        template.tasks.some((task: TemplateWithTasks['tasks'][number]) => task.title.toLowerCase().includes(query.toLowerCase()))
      )
    : allTemplates;

  if (templates.length === 0 && query) {
    return <p className="text-gray-500 text-center py-8">No templates found matching "{query}"</p>;
  }

  return <TemplatesList templates={templates} />;
}

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Templates</h1>
        <SearchBar placeholder="Search templates..." />
      </div>
      
      <p className="text-gray-600 mb-6">
        Create reusable task templates for common onboarding scenarios (e.g., IT Setup, HR Orientation).
        Assign templates to employees to automatically create all associated tasks.
      </p>
      
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="animate-pulse border rounded-lg p-6 bg-gray-50">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      }>
        <TemplatesContent query={query} />
      </Suspense>
    </div>
  );
}

