'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LoadingPage, ErrorMessage } from '@/components/ui';
import { getFramework, getFrameworkSummary } from '@/lib/api';
import { useUserId } from '@/lib/hooks/useUserId';
import { CSFFunction, FrameworkSummary } from '@/lib/types';

export default function FrameworkPage() {
  const userId = useUserId();
  const [functions, setFunctions] = useState<CSFFunction[]>([]);
  const [summary, setSummary] = useState<FrameworkSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchFramework = async () => {
      try {
        const [functionsData, summaryData] = await Promise.all([
          getFramework(userId),
          getFrameworkSummary(userId),
        ]);
        setFunctions(functionsData);
        setSummary(summaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load framework');
      } finally {
        setLoading(false);
      }
    };

    fetchFramework();
  }, [userId]);

  if (!userId || loading) {
    return <LoadingPage message="Loading NIST CSF 2.0 framework..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        NIST CSF 2.0 Framework Reference
      </h1>

      {summary && (
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{summary.functions_count}</p>
                <p className="text-sm text-gray-500">Functions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{summary.categories_count}</p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{summary.subcategories_count}</p>
                <p className="text-sm text-gray-500">Subcategories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {functions.map((func) => (
          <Card key={func.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedFunction(expandedFunction === func.id ? null : func.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded">
                    {func.code}
                  </span>
                  <CardTitle>{func.name}</CardTitle>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedFunction === func.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {func.description && (
                <p className="text-sm text-gray-500 mt-1">{func.description}</p>
              )}
            </CardHeader>

            {expandedFunction === func.id && func.categories && (
              <CardContent>
                <div className="space-y-3">
                  {func.categories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <div
                        className="p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedCategory(expandedCategory === category.id ? null : category.id)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-sm font-medium rounded">
                              {category.code}
                            </span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedCategory === category.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {expandedCategory === category.id && category.subcategories && (
                        <div className="border-t bg-gray-50 p-3">
                          <div className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="p-2 bg-white rounded border text-sm"
                              >
                                <span className="font-medium text-purple-700">
                                  {subcategory.code}
                                </span>
                                <p className="text-gray-600 mt-1">{subcategory.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
