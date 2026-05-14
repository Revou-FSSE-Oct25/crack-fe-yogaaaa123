// CSRF token cache — fetched once, reused across mutations
let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

export async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  if (csrfPromise) return csrfPromise;

  csrfPromise = (async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const res = await fetch(`${baseUrl}/auth/csrf-token`, { credentials: 'include' });
    if (!res.ok) throw new Error(`CSRF fetch failed: ${res.status}`);
    const body = await res.json();
    // BE returns { statusCode, message, data: { csrf_token }, timestamp }
    const token = body?.data?.csrf_token ?? body?.csrf_token;
    csrfToken = token;
    // Auto-refresh after 10 min (token expires in 24h)
    setTimeout(() => { csrfToken = null; }, 10 * 60 * 1000);
    return token;
  })();

  return csrfPromise;
}

export function resetCsrfToken(): void {
  csrfToken = null;
  csrfPromise = null;
}
