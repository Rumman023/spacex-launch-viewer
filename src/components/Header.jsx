const Header = ({ lastUpdated, onRefresh }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚀</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SpaceX Launch Viewer</h1>
              <p className="text-gray-400 text-sm">Explore SpaceX missions and launches</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Real-time data from SpaceX API</p>
              {lastUpdated && (
                <p className="text-blue-400 text-xs">Last updated: {lastUpdated}</p>
              )}
            </div>
            
            <button
              onClick={onRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
              title="Refresh launch data"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 