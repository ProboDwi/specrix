import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl font-black text-gray-800 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-400 mb-8">Gadget atau halaman yang kamu cari tidak ada.</p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
