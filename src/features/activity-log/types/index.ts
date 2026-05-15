// ---
// Activity Log Domain Types
// ---

export interface ActivityLogEntry {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: string;
  entityId?: string;
  userId: string;
  userName: string;
  user?: { id: string; username: string; role: string };
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
}
