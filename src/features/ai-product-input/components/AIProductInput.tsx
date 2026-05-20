'use client';

import { useState } from 'react';
import { useAIProductInput, type AIProductItem } from '../hooks/useAIProductInput';
import { useProcessAiBatch } from '../hooks/useProcessAiBatch';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { XCircle, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function AIProductInput() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<AIProductItem[]>([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Audit Table

  const aiProductInputMutation = useAIProductInput();
  const processAiBatchMutation = useProcessAiBatch();

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

  const handleProcessImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      aiProductInputMutation.mutate({ image: selectedFile }, {
        onSuccess: (data) => {
          setExtractedItems(data.map(item => ({ ...item, id: item.id || uuidv4() }))); // Ensure unique IDs
          setStep(2); // Move to audit step
        },
        onError: () => {
          setExtractedItems([]); // Clear any previous items on error
        },
      });
    }
  };

  const handleItemChange = (id: string, field: keyof AIProductItem, value: any) => {
    setExtractedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setExtractedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirmBatch = () => {
    if (extractedItems.length > 0) {
      processAiBatchMutation.mutate(extractedItems, {
        onSuccess: (response) => {
          alert(`Batch processed: ${response.created} created, ${response.updated} updated. Warnings: ${response.warnings.length}, Errors: ${response.errors.length}`);
          setExtractedItems([]);
          setSelectedFile(null);
          setPreview(null);
          setStep(1); // Back to upload step
        },
        onError: (error) => {
          alert(`Failed to process batch: ${error.message}`);
        },
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Product Input from Receipt</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload a receipt image and let AI extract product details for bulk inventory update.
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleProcessImage} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="receipt-upload" className="mb-2 block text-sm font-medium text-gray-700">Receipt Image</label>
            <input
            id="receipt-upload"
            type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="h-64 w-auto rounded-lg border border-gray-200 object-contain" />
            </div>
          )}

          {aiProductInputMutation.isError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Failed to process image. Please ensure it's a clear receipt.
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" isLoading={aiProductInputMutation.isPending} disabled={!selectedFile}>
              Process Receipt with AI
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Extracted Products</h3>
          
          {extractedItems.length === 0 && (
            <div className="text-center text-gray-500 py-8">No items extracted.</div>
          )}

          {extractedItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {extractedItems.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Input 
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Input
                          value={item.sku || ''}
                          onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Input
                          value={item.categoryName || ''}
                          onChange={(e) => handleItemChange(item.id, 'categoryName', e.target.value)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Input
                          value={item.supplierName || ''}
                          onChange={(e) => handleItemChange(item.id, 'supplierName', e.target.value)}
                          className="!p-0 !border-none !ring-0 !shadow-none !bg-transparent text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {processAiBatchMutation.isError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Failed to confirm batch: {(processAiBatchMutation.error as Error)?.message ?? 'Unknown error.'}
            </div>
          )}
          {processAiBatchMutation.isSuccess && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-600">
              Batch processed successfully!
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <PlusCircle className="h-4 w-4 mr-2" /> Upload New Receipt
            </Button>
            <Button 
              onClick={handleConfirmBatch} 
              isLoading={processAiBatchMutation.isPending} 
              disabled={extractedItems.length === 0}
              variant="primary"
            >
              Konfirmasi & Tambahkan ke Inventaris
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
