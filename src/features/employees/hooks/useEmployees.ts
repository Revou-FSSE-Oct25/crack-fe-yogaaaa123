import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

interface Employee {
  id: string;
  username: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: string;
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get<Employee[]>('/users'),
  });
}
