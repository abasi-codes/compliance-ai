import { X, FileText, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';
import { Report } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
}

export function ReportViewer({ report, onClose }: ReportViewerProps) {
  const content = report.content;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold gradient-text">{report.title}</h2>
        <Button variant="secondary" onClick={onClose} leftIcon={<X className="h-4 w-4" />}>
          Close
        </Button>
      </div>

      {/* Executive Summary */}
      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<FileText className="h-5 w-5" />}>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Maturity Score */}
            <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100 flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">Overall Maturity:</span>
              <span className="text-4xl font-bold gradient-text">
                {content.executive_summary.overall_maturity.toFixed(1)}
              </span>
              <span className="text-lg text-slate-400">/4.0</span>
            </div>

            {/* Key Strengths */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Key Strengths</h4>
              <ul className="space-y-2">
                {content.executive_summary.key_strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Gaps */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Critical Gaps</h4>
              <ul className="space-y-2">
                {content.executive_summary.critical_gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Recommendations</h4>
              <p className="text-sm text-slate-600">
                {content.executive_summary.recommendations_summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maturity by Function */}
      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<BarChart3 className="h-5 w-5" />}>Maturity by Function</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.maturity_summary.by_function.map((func, index) => (
              <div
                key={func.code}
                className="flex items-center justify-between animate-slideInUp opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg">
                    {func.code}
                  </span>
                  <span className="text-sm text-slate-700">{func.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-accent-500 rounded-full h-2.5 transition-all duration-500"
                      style={{ width: `${(func.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-8">{func.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deviations Summary */}
      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<AlertTriangle className="h-5 w-5" />}>Deviations Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
              <p className="text-3xl font-bold gradient-text">
                {content.deviations.total_count}
              </p>
              <p className="text-sm text-slate-500 mt-1">Total</p>
            </div>
            {Object.entries(content.deviations.by_severity).map(([severity, count]) => {
              const config: Record<string, { bg: string; border: string; text: string }> = {
                CRITICAL: { bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-700' },
                HIGH: { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-700' },
                MEDIUM: { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-700' },
                LOW: { bg: 'from-accent-50 to-accent-100', border: 'border-accent-200', text: 'text-accent-700' },
              };
              const style = config[severity] || { bg: 'from-slate-50 to-slate-100', border: 'border-slate-200', text: 'text-slate-700' };

              return (
                <div
                  key={severity}
                  className={cn(
                    'p-4 rounded-xl border text-center bg-gradient-to-br',
                    style.bg,
                    style.border
                  )}
                >
                  <p className={cn('text-3xl font-bold', style.text)}>{count}</p>
                  <p className="text-sm text-slate-500 mt-1 capitalize">{severity.toLowerCase()}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card animated>
        <CardHeader variant="gradient">
          <CardTitle icon={<Lightbulb className="h-5 w-5" />}>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {content.recommendations.immediate.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Immediate Actions
                </h4>
                <div className="space-y-3">
                  {content.recommendations.immediate.map((rec, i) => (
                    <div key={i} className="pl-4 border-l-2 border-red-200 py-2">
                      <p className="font-medium text-slate-900">{rec.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.recommendations.short_term.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Short-term Actions
                </h4>
                <div className="space-y-3">
                  {content.recommendations.short_term.map((rec, i) => (
                    <div key={i} className="pl-4 border-l-2 border-amber-200 py-2">
                      <p className="font-medium text-slate-900">{rec.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.recommendations.long_term.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-accent-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500" />
                  Long-term Actions
                </h4>
                <div className="space-y-3">
                  {content.recommendations.long_term.map((rec, i) => (
                    <div key={i} className="pl-4 border-l-2 border-accent-200 py-2">
                      <p className="font-medium text-slate-900">{rec.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
