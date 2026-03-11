'use client';

import { useState } from 'react';
import { StockMovementsTable } from '@/features/inventory/components/StockMovementsTable';
import { StockMovementForm } from '@/features/inventory/components/StockMovementForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function InventoryPage() {
  const [modalType, setModalType] = useState<'IN' | 'OUT' | null>(null);
  const [activeTab, setActiveTab] = useState<'IN' | 'OUT'>('IN');

  const handleClose = () => setModalType(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline-danger"
            onClick={() => setModalType('OUT')}
          >
            - Catat Keluar
          </Button>
          <Button 
            variant="success"
            onClick={() => setModalType('IN')}
          >
            + Catat Masuk
          </Button>
        </div>
      </div>

      <p className="text-gray-500">
        Kelola pencatatan stok masuk (restock) dan stok keluar (terjual manual/rusak) dalam tab yang terpisah.
      </p>

      {/* Tabs Layout */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('IN')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'IN'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Barang Masuk
          </button>
          <button
            onClick={() => setActiveTab('OUT')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'OUT'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Barang Keluar
          </button>
        </nav>
      </div>

      <div className="mt-2">
        {activeTab === 'IN' ? (
          <StockMovementsTable filterType="IN" />
        ) : (
          <StockMovementsTable filterType="OUT" />
        )}
      </div>

      <Modal
        isOpen={modalType !== null}
        onClose={handleClose}
        title={modalType === 'IN' ? 'Catat Barang Masuk' : 'Catat Barang Keluar'}
      >
        {modalType && (
          <StockMovementForm 
            type={modalType} 
            onSuccess={handleClose} 
          />
        )}
      </Modal>
    </div>
  );
}
