import { FileText, Download, Eye, CheckCircle2, FolderOpen, FileJson } from 'lucide-react';
import { Report } from '@/lib/types';
import { Card, CardContent, Button } from '@/components/ui';
import { getReportDownloadUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ReportListProps {
  reports: Report[];
  onView: (reportId: string) => void;
}

export function ReportList({ reports, onView }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="mx-auto h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <FolderOpen className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900">No reports generated yet</h3>
        <p className="mt-2 text-sm text-neutral-500">Generate a report to see it listed here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} hover className="overflow-hidden">
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* File icon */}
                <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <FileJson className="h-6 w-6 text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-neutral-900 truncate">{report.title}</h3>
                    {report.is_final && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Final
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-neutral-400">Type:</span>
                      <span className="font-medium">{report.report_type}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-neutral-400">Version:</span>
                      <span className="font-medium">{report.version}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-neutral-400">Generated:</span>
                      <span className="font-medium">{new Date(report.generated_at).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(report.id)}
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  View
                </Button>
                <a
                  href={getReportDownloadUrl(report.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
