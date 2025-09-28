// Re-export all types for easy importing
export * from './auth';
export * from './navigation';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
