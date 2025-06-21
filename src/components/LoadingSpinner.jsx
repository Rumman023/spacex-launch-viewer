const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Launches</h2>
        <p className="text-gray-400">Fetching data from SpaceX API...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner 