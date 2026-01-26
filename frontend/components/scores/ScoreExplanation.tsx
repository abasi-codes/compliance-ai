import { FileText, Gauge, Quote } from 'lucide-react';
import { ExplanationPayload } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ScoreExplanationProps {
  explanation: ExplanationPayload;
}

export function ScoreExplanation({ explanation }: ScoreExplanationProps) {
  return (
    <div className="space-y-6">
      {/* Rationale */}
      <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-neutral-200">
        <h4 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
          <Quote className="h-4 w-4 text-primary-500" />
          Rationale
        </h4>
        <p className="text-sm text-neutral-600 leading-relaxed">{explanation.rationale}</p>
      </div>

      {/* Score Components */}
      {explanation.components && explanation.components.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary-500" />
            Score Components
          </h4>
          <div className="space-y-2">
            {explanation.components.map((component, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border transition-all duration-200',
                  'bg-white hover:bg-neutral-50 border-neutral-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{component.type}</span>
                  {component.source && (
                    <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                      {component.source}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'font-semibold px-2 py-1 rounded-lg text-sm',
                  typeof component.contribution === 'number' && component.contribution > 0
                    ? 'bg-accent-50 text-accent-700'
                    : 'bg-neutral-100 text-neutral-700'
                )}>
                  {typeof component.contribution === 'number'
                    ? `+${component.contribution.toFixed(2)}`
                    : component.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Citations */}
      {explanation.evidence_citations && explanation.evidence_citations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-500" />
            Evidence
          </h4>
          <div className="space-y-2">
            {explanation.evidence_citations.map((citation, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-neutral-200 text-sm"
              >
                <span className="font-semibold text-primary-600">{citation.source}:</span>
                <span className="text-neutral-600 ml-1">{citation.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Factors */}
      {explanation.confidence_factors && Object.keys(explanation.confidence_factors).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Confidence Factors</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(explanation.confidence_factors).map(([factor, value]) => (
              <div
                key={factor}
                className="flex justify-between items-center p-3 bg-white rounded-lg border border-neutral-200"
              >
                <span className="text-sm text-neutral-600 capitalize">
                  {factor.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 min-w-[40px] text-right">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
