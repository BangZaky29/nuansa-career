export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Nuansa Legal Career Hub
      </h1>
      <p className="text-lg text-gray-600">
        Platform lowongan kerja resmi dari Nuansa Legal.
      </p>
      <div className="mt-8 flex gap-4">
        <a href="/loker" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
          Lihat Lowongan
        </a>
        <a href="/admin/login" className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
          Login Admin
        </a>
      </div>
    </main>
  );
}
