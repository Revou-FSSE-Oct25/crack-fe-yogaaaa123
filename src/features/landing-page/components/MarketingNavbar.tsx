import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_KEY } from '@/infrastructure/utils/constants';

export async function MarketingNavbar() {
  const cookieStore = await cookies();
  // Server-side check for the HttpOnly auth_token
  const isLoggedIn = !!cookieStore.get(AUTH_TOKEN_KEY)?.value;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight text-emerald-700">
          CrackPOS
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="#features" className="text-slate-600 hover:text-emerald-700 transition-colors">
            Fitur
          </Link>
          <Link href="#pricing" className="text-slate-600 hover:text-emerald-700 transition-colors">
            Harga
          </Link>
          <Link href="#faq" className="text-slate-600 hover:text-emerald-700 transition-colors">
            FAQ
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard/admin" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Kembali ke Dashboard
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
