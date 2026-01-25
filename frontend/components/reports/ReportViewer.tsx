import { Report } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
}

export function ReportViewer({ report, onClose }: ReportViewerProps) {
  const content = report.content;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Overall Maturity:</span>
              <span className="text-2xl font-bold text-blue-600">
                {content.executive_summary.overall_maturity.toFixed(1)}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {content.executive_summary.key_strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Critical Gaps</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {content.executive_summary.critical_gaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
              <p className="text-sm text-gray-600">
                {content.executive_summary.recommendations_summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maturity by Function</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.maturity_summary.by_function.map((func) => (
              <div key={func.code} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{func.code}</span>
                  <span className="text-gray-500 ml-2">{func.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${(func.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{func.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deviations Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {content.deviations.total_count}
              </p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            {Object.entries(content.deviations.by_severity).map(([severity, count]) => (
              <div key={severity} className="text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-500">{severity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {content.recommendations.immediate.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Immediate Actions</h4>
                <ul className="space-y-2">
                  {content.recommendations.immediate.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-red-200">
                      <span className="font-medium">{rec.title}</span>
                      <p className="text-gray-500">{rec.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.recommendations.short_term.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-600 mb-2">Short-term Actions</h4>
                <ul className="space-y-2">
                  {content.recommendations.short_term.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-yellow-200">
                      <span className="font-medium">{rec.title}</span>
                      <p className="text-gray-500">{rec.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.recommendations.long_term.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-2">Long-term Actions</h4>
                <ul className="space-y-2">
                  {content.recommendations.long_term.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-green-200">
                      <span className="font-medium">{rec.title}</span>
                      <p className="text-gray-500">{rec.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
