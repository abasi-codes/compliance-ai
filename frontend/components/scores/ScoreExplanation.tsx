import { ExplanationPayload } from '@/lib/types';

interface ScoreExplanationProps {
  explanation: ExplanationPayload;
}

export function ScoreExplanation({ explanation }: ScoreExplanationProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Rationale</h4>
        <p className="text-sm text-gray-600">{explanation.rationale}</p>
      </div>

      {explanation.components && explanation.components.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Score Components</h4>
          <div className="space-y-2">
            {explanation.components.map((component, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <div>
                  <span className="font-medium">{component.type}</span>
                  {component.source && (
                    <span className="text-gray-500 ml-2">({component.source})</span>
                  )}
                </div>
                <span className="font-medium">
                  {typeof component.contribution === 'number'
                    ? `+${component.contribution.toFixed(2)}`
                    : component.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.evidence_citations && explanation.evidence_citations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            {explanation.evidence_citations.map((citation, index) => (
              <li key={index}>
                <span className="font-medium">{citation.source}:</span> {citation.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {explanation.confidence_factors && Object.keys(explanation.confidence_factors).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Confidence Factors</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(explanation.confidence_factors).map(([factor, value]) => (
              <div key={factor} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{factor}</span>
                <span className="font-medium">{(value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
