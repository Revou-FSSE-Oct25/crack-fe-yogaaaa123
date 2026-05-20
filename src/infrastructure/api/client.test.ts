import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

vi.mock('./csrf', () => ({
  fetchCsrfToken: vi.fn(),
  resetCsrfToken: vi.fn(),
}));

describe('apiClient', () => {
  const globalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.mocked(fetchCsrfToken).mockResolvedValue('test-csrf-token');
  });

  afterEach(() => {
    global.fetch = globalFetch;
    vi.clearAllMocks();
  });

  it('should include CSRF token for UNSAFE methods', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ statusCode: 200, data: {} }),
    } as Response);

    await apiClient.post('/test', { foo: 'bar' });

    expect(fetchCsrfToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
      })
    );
    
    const headers = vi.mocked(global.fetch).mock.calls[0][1]?.headers as Headers;
    expect(headers.get('X-CSRF-Token')).toBe('test-csrf-token');
  });

  it('should attempt refresh and retry on 401', async () => {
    // 1st call: 401
    // 2nd call (refresh): 200 OK
    // 3rd call (retry): 200 OK
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ statusCode: 200, data: { success: true } }),
      } as Response);

    const result = await apiClient.get('/protected');

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/auth/refresh'), expect.any(Object));
    expect(result).toEqual({ success: true });
  });
});
