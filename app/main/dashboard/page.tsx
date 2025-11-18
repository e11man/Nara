import { Suspense } from 'react';
import { AIOverviewButton } from './components/AIOverviewButton';
import { EmployeeList } from './components/EmployeeList';
import { SearchBar } from '../components/SearchBar';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">HR Onboarding Dashboard</h1>
      
      <div className="flex gap-4 items-center mb-8">
        <AIOverviewButton />
        <SearchBar placeholder="Search employees..." />
      </div>

      <Suspense fallback={
        <div className="space-y-8">
          <div className="border p-4 rounded-lg shadow-sm bg-gray-50 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      }>
        <EmployeeList query={query} />
      </Suspense>
    </div>
  );
}