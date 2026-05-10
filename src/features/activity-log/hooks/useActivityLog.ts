'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import type { ActivityLogEntry, ActivityLogQueryParams } from '../types';
import type { PaginatedResponse } from '@/infrastructure/api/types';

export function useActivityLog() {
  const searchParams = useSearchParams();

  const params: ActivityLogQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
    action: searchParams.get('action') ?? undefined,
    entity: searchParams.get('entity') ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  };

  const qs = new URLSearchParams();
  qs.set('page', String(params.page));
  qs.set('limit', String(params.limit));
  if (params.action) qs.set('action', params.action);
  if (params.entity) qs.set('entity', params.entity);
  if (params.startDate) qs.set('startDate', params.startDate);
  if (params.endDate) qs.set('endDate', params.endDate);

  return useQuery({
    queryKey: ['activity-log', params],
    queryFn: () => apiClient<PaginatedResponse<ActivityLogEntry>>(`/activity-log?${qs.toString()}`),
  });
}
