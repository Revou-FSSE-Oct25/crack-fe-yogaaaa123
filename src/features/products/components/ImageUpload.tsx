'use client';

import { useState, useRef } from 'react';
import { useUploadImage } from '../hooks/useUploadImage';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadImage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: (data) => {
        onChange(data.url);
        setSelectedFile(null);
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Upload failed');
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a proper FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const fakeEvent = {
        target: { files: dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-gray-700">Product Image</label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-lg border border-gray-300 object-cover"
          />
          {!value && selectedFile && (
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                onClick={handleUpload}
                isLoading={uploadMutation.isPending}
                size="sm"
              >
                Upload Image
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          {value && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => {
                setPreview(null);
                onChange('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Remove Image
            </Button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop or <span className="font-semibold text-indigo-600">browse files</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploadMutation.isError && (
        <p className="text-sm text-red-600">
          {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Upload failed'}
        </p>
      )}

      {value && !preview && (
        <input
          type="hidden"
          value={value}
        />
      )}
    </div>
  );
}
