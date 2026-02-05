'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onClose: () => void;
  itemLabel?: string;
  className?: string;
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onApprove,
  onReject,
  onClose,
  itemLabel = 'item',
  className,
}: BulkActionBarProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsApproving(true);
    try {
      await onApprove();
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setIsRejecting(true);
    try {
      await onReject();
    } finally {
      setIsRejecting(false);
      setShowConfirmReject(false);
    }
  };

  if (selectedCount === 0) return null;

  const pluralLabel = selectedCount === 1 ? itemLabel : `${itemLabel}s`;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'bg-neutral-900 text-white rounded-xl shadow-2xl',
        'px-6 py-4 flex items-center gap-4',
        'animate-in slide-in-from-bottom-4 duration-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">
          <span className="font-semibold">{selectedCount}</span> {pluralLabel} selected
        </span>
        <div className="h-4 w-px bg-neutral-700" />
        <button
          onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
          className="text-sm text-primary-400 hover:text-primary-300"
        >
          {selectedCount === totalCount ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {showConfirmReject ? (
          <>
            <span className="text-sm text-warning-400 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Confirm rejection?
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReject}
              loading={isRejecting}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Yes, reject
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmReject(false)}
              className="text-white hover:bg-neutral-800"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            {onApprove && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                loading={isApproving}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Approve
              </Button>
            )}
            {onReject && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmReject(true)}
                className="text-white bg-neutral-700 hover:bg-neutral-600"
                leftIcon={<XCircle className="h-4 w-4" />}
              >
                Reject
              </Button>
            )}
          </>
        )}
      </div>

      <button
        onClick={onClose}
        className="ml-2 p-1 rounded hover:bg-neutral-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
