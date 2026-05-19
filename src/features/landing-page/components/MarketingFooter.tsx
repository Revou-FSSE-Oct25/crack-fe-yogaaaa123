import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-semibold text-white mb-4">CrackPOS</h4>
          <p className="text-sm">
            Sistem manajemen inventaris dan POS revolusioner untuk bisnis Anda.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Produk</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#features" className="hover:text-white transition-colors">Fitur</Link></li>
            <li><Link href="#ai-showcase" className="hover:text-white transition-colors">AI Assistant</Link></li>
            <li><Link href="#pricing" className="hover:text-white transition-colors">Harga</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
            <li><Link href="#contact" className="hover:text-white transition-colors">Kontak</Link></li>
            <li><Link href="#careers" className="hover:text-white transition-colors">Karir</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Sumber Daya</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="#support" className="hover:text-white transition-colors">Dukungan</Link></li>
            <li><Link href="#privacy" className="hover:text-white transition-colors">Privasi</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
        &copy; 2026 CrackPOS. All rights reserved. <Link href="/login" className="underline hover:text-white">Login Admin</Link>
      </div>
    </footer>
  );
}
