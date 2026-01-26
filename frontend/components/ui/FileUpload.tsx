'use client';

import { useCallback, useState } from 'react';
import { Upload, File, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  multiple?: boolean;
}

export function FileUpload({
  accept,
  onFileSelect,
  uploading = false,
  label,
  helperText,
  error,
  multiple = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8',
          'transition-all duration-200 cursor-pointer',
          'hover:border-primary-400 hover:bg-primary-50/50',
          dragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-neutral-300',
          error && 'border-red-500 bg-red-50',
          uploading && 'pointer-events-none opacity-60'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className="text-center">
          <div className={cn(
            'mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4',
            'transition-colors duration-200',
            dragActive ? 'bg-primary-100' : 'bg-neutral-100',
            error && 'bg-red-100'
          )}>
            {uploading ? (
              <Loader2 className="h-7 w-7 text-primary-600 animate-spin" />
            ) : selectedFile && !error ? (
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            ) : (
              <Upload className={cn(
                'h-7 w-7',
                dragActive ? 'text-primary-600' : 'text-neutral-400',
                error && 'text-red-500'
              )} />
            )}
          </div>

          <div className="flex text-sm text-neutral-600 justify-center">
            <span className={cn(
              'font-semibold',
              dragActive ? 'text-primary-600' : 'text-primary-600 hover:text-primary-700'
            )}>
              Click to upload
            </span>
            <span className="pl-1 text-neutral-500">or drag and drop</span>
          </div>

          {helperText && (
            <p className="mt-2 text-xs text-neutral-500">{helperText}</p>
          )}

          {selectedFile && !uploading && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
              <File className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700 font-medium">
                {selectedFile.name}
              </span>
            </div>
          )}

          {uploading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm text-primary-600 font-medium">Uploading...</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
