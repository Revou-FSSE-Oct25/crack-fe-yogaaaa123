import { RefreshCw, LayoutGrid, ShieldCheck, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Fitur Canggih untuk Bisnis Modern
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            CrackPOS memberikan Anda kendali penuh atas operasional toko dengan teknologi terbaru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Large */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 bg-white bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sinkronisasi Real-Time</h3>
              <p className="text-slate-600 max-w-md">
                Stok di toko fisik dan online ter-update dalam milidetik. Hindari overselling dan pastikan data Anda selalu akurat di mana saja, kapan saja.
              </p>
            </div>
            {/* Visual element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl group-hover:bg-emerald-200/50 transition-colors duration-500"></div>
          </div>

          {/* Bento Card 2: Square */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Multi-Toko</h3>
            <p className="text-slate-600">
              Kelola banyak cabang dan gudang dari satu dashboard terpusat tanpa ribet.
            </p>
          </div>

          {/* Bento Card 3: Square */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Keamanan Tinggi</h3>
            <p className="text-slate-600">
              Data terenkripsi, HttpOnly Cookies, dan proteksi CSRF untuk keamanan bisnis Anda.
            </p>
          </div>

          {/* Bento Card 4: Large */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 bg-white bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Laporan Keuangan Otomatis</h3>
              <p className="text-slate-600 max-w-md">
                Pantau Profit & Loss, arus kas, dan performa penjualan secara instan. Buat keputusan bisnis berdasarkan data nyata, bukan insting.
              </p>
            </div>
            {/* Visual element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
