'use client';

import { useMutation } from '@tanstack/react-query';
import { downloadCsv } from '@/infrastructure/utils/downloadCsv';

interface ExportCsvParams {
  endpoint: string;
  filename: string;
}

export function useExportCsv() {
  return useMutation({
    mutationFn: async ({ endpoint, filename }: ExportCsvParams) => {
      await downloadCsv(endpoint, filename);
    },
  });
}
