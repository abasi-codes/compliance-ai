'use client';

import { Trash2, FolderOpen } from 'lucide-react';
import { Control } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ControlTableProps {
  controls: Control[];
  onDelete?: (controlId: string) => void;
}

export function ControlTable({ controls, onDelete }: ControlTableProps) {
  if (controls.length === 0) {
    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FolderOpen className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No controls uploaded yet</h3>
        <p className="mt-2 text-sm text-slate-500">Upload a CSV or XLSX file to get started</p>
      </div>
    );
  }

  const getStatusStyles = (status: string | undefined | null) => {
    switch (status) {
      case 'Implemented':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Partial':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Planned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Identifier
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              {onDelete && (
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {controls.map((control, index) => (
              <tr
                key={control.id}
                className={cn(
                  'transition-colors duration-150',
                  'hover:bg-primary-50/50',
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-primary-600">
                    {control.identifier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-sm text-slate-900" title={control.name}>
                    {control.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {control.owner || <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {control.control_type || <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      'inline-flex px-2.5 py-1 text-xs font-medium rounded-lg border',
                      getStatusStyles(control.implementation_status)
                    )}
                  >
                    {control.implementation_status || 'Unknown'}
                  </span>
                </td>
                {onDelete && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onDelete(control.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
