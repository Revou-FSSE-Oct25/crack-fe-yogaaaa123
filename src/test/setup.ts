import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}));

// Mock process.env
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
