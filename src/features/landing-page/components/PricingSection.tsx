import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Free',
    price: 'Rp 0',
    features: [
      'Maksimal 50 Produk',
      'Standar POS',
      'Laporan Dasar',
      'Dukungan Komunitas',
    ],
    cta: 'Mulai Gratis',
    ctaLink: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'Rp 149rb',
    duration: '/bln',
    features: [
      'Unlimited Produk',
      'Manajemen Stok Lanjutan',
      'Laporan Lengkap',
      'Dukungan Email',
      'Tanpa AI Assistant',
    ],
    cta: 'Pilih Pro',
    ctaLink: '/register?plan=pro',
    highlight: false,
  },
  {
    name: 'Ultra',
    price: 'Rp 299rb',
    duration: '/bln',
    features: [
      'Unlimited Produk',
      'Semua Fitur Pro',
      'AI Assistant (Scan Faktur & Chat)',
      'Prioritas Dukungan',
      'Integrasi API Eksternal',
    ],
    cta: 'Pilih Ultra',
    ctaLink: '/register?plan=ultra',
    highlight: true,
    badge: 'Paling Populer',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          Pilih Paket Terbaik untuk Bisnis Anda
        </h2>
        <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
          Mulai dengan gratis atau tingkatkan ke paket Pro dan Ultra untuk fitur manajemen inventaris yang lebih canggih, termasuk AI Assistant revolusioner.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-2xl shadow-sm border border-slate-200 bg-white transition-all duration-300 
                ${tier.highlight ? 'ring-2 ring-emerald-500 bg-emerald-50/50 scale-105 shadow-xl' : 'hover:shadow-lg'}
              `}
            >
              {tier.badge && (
                <span className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{tier.name}</h3>
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">
                {tier.price}
                {tier.duration && <span className="text-lg font-medium text-slate-500">{tier.duration}</span>}
              </div>
              <p className="text-slate-500 mb-8">per bulan</p>
              
              <ul className="flex-grow text-left space-y-3 mb-10 text-slate-700">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={tier.ctaLink} className={`block w-full text-center text-lg font-semibold px-6 py-3 rounded-lg 
                ${tier.highlight ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}
                transition-colors duration-200
              `}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
