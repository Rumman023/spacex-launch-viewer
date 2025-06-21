import LaunchCard from './LaunchCard'

const LaunchList = ({ launches, onLaunchSelect }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Recent Launches</h2>
        <p className="text-gray-400">Explore the latest SpaceX missions and their details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {launches.map((launch) => (
          <LaunchCard 
            key={launch.id} 
            launch={launch} 
            onSelect={onLaunchSelect}
          />
        ))}
      </div>
      
      {launches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No launches found</p>
        </div>
      )}
    </div>
  )
}

export default LaunchList 