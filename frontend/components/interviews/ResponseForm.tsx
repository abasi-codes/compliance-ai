'use client';

import { useState } from 'react';
import { Button, Textarea, Select } from '@/components/ui';
import { InterviewQuestion, InterviewResponseCreate } from '@/lib/types';

interface ResponseFormProps {
  question: InterviewQuestion;
  onSubmit: (response: InterviewResponseCreate) => Promise<void>;
  loading?: boolean;
}

const responseOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'partial', label: 'Partially' },
  { value: 'no', label: 'No' },
  { value: 'not_applicable', label: 'Not Applicable' },
];

const confidenceOptions = [
  { value: 'high', label: 'High - Very confident' },
  { value: 'medium', label: 'Medium - Somewhat confident' },
  { value: 'low', label: 'Low - Uncertain' },
];

export function ResponseForm({ question, onSubmit, loading }: ResponseFormProps) {
  const [responseValue, setResponseValue] = useState('');
  const [responseText, setResponseText] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      question_id: question.id,
      response_value: responseValue,
      response_text: responseText,
      confidence_level: confidenceLevel,
    });

    setResponseValue('');
    setResponseText('');
    setConfidenceLevel('medium');
  };

  const isYesNo = question.question_type === 'yes_no' || question.question_type === 'boolean';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isYesNo && (
        <div className="grid grid-cols-4 gap-2">
          {responseOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setResponseValue(option.value)}
              className={`
                p-3 rounded-lg border-2 text-sm font-medium transition-colors
                ${
                  responseValue === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <Textarea
        label="Additional Details"
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Provide context, examples, or references to support your answer..."
        rows={4}
      />

      <Select
        label="Confidence Level"
        value={confidenceLevel}
        onChange={(e) => setConfidenceLevel(e.target.value)}
        options={confidenceOptions}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          disabled={isYesNo && !responseValue}
        >
          Submit Response
        </Button>
      </div>
    </form>
  );
}
