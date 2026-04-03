export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-24 px-5 sm:px-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="w-28 h-3 bg-gray-800 rounded animate-pulse mb-3" />
        <div className="w-48 h-9 bg-gray-800 rounded animate-pulse mb-3" />
        <div className="w-36 h-3 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[#111] border border-gray-800 rounded-xl p-6 animate-pulse">
            <div className="w-20 h-2.5 bg-gray-800 rounded mb-3" />
            <div className="w-full h-5 bg-gray-800 rounded mb-2" />
            <div className="w-4/5 h-5 bg-gray-800 rounded mb-4" />
            <div className="w-full h-3 bg-gray-800 rounded mb-1.5" />
            <div className="w-3/4 h-3 bg-gray-800 rounded mb-6" />
            <div className="flex justify-between pt-4 border-t border-gray-900">
              <div className="w-16 h-2.5 bg-gray-800 rounded" />
              <div className="w-10 h-2.5 bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
