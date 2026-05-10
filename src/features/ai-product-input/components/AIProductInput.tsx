'use client';

import { useState } from 'react';
import { useAIProductInput } from '../hooks/useAIProductInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AIProductInput() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const aiProductInput = useAIProductInput();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      aiProductInput.mutate({ image: selectedFile });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Product Input</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload product image and AI will extract product details automatically
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="h-64 w-auto rounded-lg border border-gray-200" />
          </div>
        )}

        {aiProductInput.isSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-900">Extracted Product Details:</h3>
            <div className="space-y-1 text-sm text-green-800">
              <p><strong>Name:</strong> {aiProductInput.data.name}</p>
              <p><strong>SKU:</strong> {aiProductInput.data.sku}</p>
              <p><strong>Price:</strong> Rp {aiProductInput.data.price.toLocaleString('id-ID')}</p>
              <p><strong>Stock:</strong> {aiProductInput.data.stock}</p>
              <p><strong>Category:</strong> {aiProductInput.data.categoryName}</p>
              <p><strong>Supplier:</strong> {aiProductInput.data.supplierName}</p>
            </div>
          </div>
        )}

        {aiProductInput.isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to process image. Please try again.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" isLoading={aiProductInput.isPending} disabled={!selectedFile}>
            Process Image
          </Button>
        </div>
      </form>
    </div>
  );
}
