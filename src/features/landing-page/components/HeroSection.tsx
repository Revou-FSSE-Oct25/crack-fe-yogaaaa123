import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-white to-emerald-50 py-20 px-6 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Revolusi Cara Anda Mengelola Inventaris & Kasir
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          CrackPOS adalah sistem manajemen inventaris dan Point of Sale (POS) all-in-one yang revolusioner,
          dirancang untuk menyederhanakan operasional bisnis Anda dengan kecerdasan buatan dan sinkronisasi real-time.
        </p>
        <Link href="/register" className="inline-block bg-emerald-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
          Mulai Gratis Sekarang
        </Link>

        {/* Mock Dashboard Graphic Placeholder */}
        <div className="mt-20 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
          {/* A more stylized placeholder with subtle gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-teal-50 animate-pulse-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400 text-2xl font-bold">CrackPOS Dashboard Preview</p>
          </div>
          <div className="absolute inset-0 bg-grid-slate-200/[0.2] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        </div>
      </div>

      {/* Subtle background elements for visual interest */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
}
