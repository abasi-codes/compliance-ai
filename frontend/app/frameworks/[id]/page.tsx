'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  BarChart2,
  Settings,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, PageHeader } from '@/components/ui';
import { LoadingPage, ErrorMessage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
  getFramework,
  getFrameworkStats,
  getFrameworkHierarchy,
  updateFramework,
  deleteFramework,
} from '@/lib/api';
import { Framework, FrameworkStats, FrameworkHierarchyNode } from '@/lib/types';
import { cn } from '@/lib/utils';

const frameworkTypeColors: Record<string, string> = {
  nist_csf: 'from-blue-500 to-blue-600',
  iso_27001: 'from-green-500 to-green-600',
  soc2_tsc: 'from-purple-500 to-purple-600',
  custom: 'from-orange-500 to-orange-600',
};

const frameworkTypeLabels: Record<string, string> = {
  nist_csf: 'NIST CSF',
  iso_27001: 'ISO 27001',
  soc2_tsc: 'SOC 2',
  custom: 'Custom',
};

interface RequirementNodeProps {
  node: FrameworkHierarchyNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  hierarchyLabels?: string[] | null;
}

function RequirementNode({
  node,
  depth,
  expandedNodes,
  toggleNode,
  hierarchyLabels,
}: RequirementNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const levelLabel = hierarchyLabels?.[depth] || `Level ${depth + 1}`;

  const depthColors = [
    'bg-gradient-to-r from-primary-500 to-primary-600',
    'bg-gradient-to-r from-accent-500 to-accent-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
  ];

  return (
    <div className={cn('border-l-2', depth > 0 ? 'border-slate-200 ml-4' : 'border-transparent')}>
      <div
        className={cn(
          'p-3 bg-white rounded-lg border border-slate-200 mb-2',
          hasChildren && 'cursor-pointer hover:bg-slate-50'
        )}
        onClick={() => hasChildren && toggleNode(node.id)}
      >
        <div className="flex items-center gap-3">
          {hasChildren && (
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-400 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
          <span
            className={cn(
              'px-2 py-1 text-white text-xs font-medium rounded',
              depthColors[depth % depthColors.length]
            )}
          >
            {node.code}
          </span>
          <span className="font-medium text-slate-900 flex-1">{node.name}</span>
          {node.is_assessable && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
              Assessable
            </span>
          )}
        </div>
        {node.description && (
          <p className="text-sm text-slate-500 mt-2 ml-7">{node.description}</p>
        )}
        {node.guidance && isExpanded && (
          <div className="mt-3 ml-7 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-blue-700 mb-1">Guidance</p>
            <p className="text-sm text-blue-900">{node.guidance}</p>
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="pl-4 mt-2">
          {node.children.map((child) => (
            <RequirementNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              hierarchyLabels={hierarchyLabels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FrameworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const frameworkId = params.id as string;

  const [framework, setFramework] = useState<Framework | null>(null);
  const [stats, setStats] = useState<FrameworkStats | null>(null);
  const [hierarchy, setHierarchy] = useState<FrameworkHierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [frameworkData, statsData, hierarchyData] = await Promise.all([
          getFramework(frameworkId),
          getFrameworkStats(frameworkId),
          getFrameworkHierarchy(frameworkId),
        ]);
        setFramework(frameworkData);
        setStats(statsData);
        setHierarchy(hierarchyData);

        // Auto-expand first level
        if (hierarchyData.length > 0) {
          setExpandedNodes(new Set(hierarchyData.map((n) => n.id)));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load framework');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [frameworkId]);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: FrameworkHierarchyNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        if (node.children) collectIds(node.children);
      });
    };
    collectIds(hierarchy);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleToggleActive = async () => {
    if (!framework) return;
    try {
      const updated = await updateFramework(frameworkId, {
        is_active: !framework.is_active,
      });
      setFramework(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update framework');
    }
  };

  const handleDelete = async () => {
    if (!framework || framework.is_builtin) return;
    if (!confirm('Are you sure you want to delete this framework? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteFramework(frameworkId);
      router.push('/frameworks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete framework');
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading framework details..." />;
  }

  if (error || !framework) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error || 'Framework not found'} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/frameworks"
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Frameworks
        </Link>
      </div>

      <PageHeader
        title={framework.name}
        description={framework.description || `${frameworkTypeLabels[framework.framework_type] || 'Custom'} compliance framework`}
        icon={BookOpen}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleToggleActive}>
              <Settings className="w-4 h-4 mr-2" />
              {framework.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            {!framework.is_builtin && (
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        }
      />

      {/* Framework Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={cn(
                  'px-3 py-1.5 text-white text-sm font-semibold rounded-full bg-gradient-to-r',
                  frameworkTypeColors[framework.framework_type] || frameworkTypeColors.custom
                )}
              >
                {frameworkTypeLabels[framework.framework_type] || 'Custom'}
              </span>
              <span className="text-slate-500">v{framework.version}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span
                  className={cn(
                    'font-medium',
                    framework.is_active ? 'text-green-600' : 'text-slate-400'
                  )}
                >
                  {framework.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-900">
                  {framework.is_builtin ? 'Built-in' : 'Custom'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hierarchy Levels</span>
                <span className="font-medium text-slate-900">{framework.hierarchy_levels}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {stats && (
          <>
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart2 className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-3xl font-bold gradient-text">{stats.total_requirements}</p>
                <p className="text-sm text-slate-500">Total Requirements</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-slate-500">Assessable</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.assessable_requirements}</p>
                <p className="text-sm text-slate-500">
                  {Math.round((stats.assessable_requirements / stats.total_requirements) * 100)}% of
                  total
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Hierarchy Labels */}
      {framework.hierarchy_labels && framework.hierarchy_labels.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hierarchy Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {framework.hierarchy_labels.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    {label}
                  </span>
                  {index < framework.hierarchy_labels!.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements Hierarchy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Requirements</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hierarchy.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No requirements found</p>
          ) : (
            <div className="space-y-2">
              {hierarchy.map((node) => (
                <RequirementNode
                  key={node.id}
                  node={node}
                  depth={0}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  hierarchyLabels={framework.hierarchy_labels}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
