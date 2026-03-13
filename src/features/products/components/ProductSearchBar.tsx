'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// ---
// ProductSearchBar — URL-driven search input
// Updates the browser URL, which passively drives TanStack Query via
// useProducts() hook. The NestJS backend receives the same query string.
// ---

export function ProductSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (e.target.value) {
      params.set('search', e.target.value);
      params.set('page', '1'); // Reset to first page on new search
    } else {
      params.delete('search');
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search products…"
        defaultValue={searchParams.get('search') ?? ''}
        onChange={handleSearch}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
