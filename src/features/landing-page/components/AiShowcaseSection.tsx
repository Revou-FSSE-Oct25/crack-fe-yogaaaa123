export function AiShowcaseSection() {
  return (
    <section id="ai-showcase" className="py-20 px-6 bg-slate-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Explanation */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
            AI Assistant: Input Produk Otomatis, Tanpa Ribet!
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Jangan buang waktu input barang manual yang membosankan. Cukup foto faktur pembelian dari supplier Anda, dan biarkan AI CrackPOS secara cerdas mengekstrak semua detail:
          </p>
          <ul className="list-disc list-inside text-left text-slate-600 mt-4 space-y-2">
            <li>Nama barang</li>
            <li>Harga beli</li>
            <li>Jumlah stok</li>
            <li>Dan informasi penting lainnya</li>
          </ul>
          <p className="text-lg text-slate-600 leading-relaxed mt-4">
            Semua langsung masuk ke sistem inventaris Anda dalam hitungan detik. Fokus pada penjualan, bukan administrasi.
          </p>
        </div>

        {/* Right Side: Visual Representation of AI */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-8">
          {/* Stylized receipt card */}
          <div className="absolute top-1/4 left-1/4 w-48 h-64 bg-white rounded-lg shadow-xl rotate-6 transform transition-transform duration-500 hover:rotate-0 hover:scale-105">
            <div className="p-4 text-sm">
              <p className="font-bold mb-2">Faktur Pembelian</p>
              <p>Item A: 10 x Rp 10.000</p>
              <p>Item B: 5 x Rp 25.000</p>
              <p>Total: Rp 225.000</p>
            </div>
          </div>
          {/* Processing animation / data transformation */} 
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="absolute text-emerald-700 font-bold mt-28">Processing...</p>
          </div>
          {/* Data output simulation */}
          <div className="absolute bottom-1/4 right-1/4 w-48 h-64 bg-emerald-700 text-white rounded-lg shadow-xl -rotate-6 transform transition-transform duration-500 hover:rotate-0 hover:scale-105">
            <div className="p-4 text-sm">
              <p className="font-bold mb-2">Data Terstruktur</p>
              <p>Product: Item A</p>
              <p>Qty: 10, Price: 10000</p>
              <p>Product: Item B</p>
              <p>Qty: 5, Price: 25000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
