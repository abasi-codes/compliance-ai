import { Report } from '@/lib/types';
import { Card, CardContent, Button } from '@/components/ui';
import { getReportDownloadUrl } from '@/lib/api';

interface ReportListProps {
  reports: Report[];
  onView: (reportId: string) => void;
}

export function ReportList({ reports, onView }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reports generated yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                  {report.is_final && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                      Final
                    </span>
                  )}
                </div>
                <div className="mt-1 flex gap-4 text-sm text-gray-500">
                  <span>Type: {report.report_type}</span>
                  <span>Version: {report.version}</span>
                  <span>
                    Generated: {new Date(report.generated_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(report.id)}>
                  View
                </Button>
                <a
                  href={getReportDownloadUrl(report.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm">
                    Download JSON
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
