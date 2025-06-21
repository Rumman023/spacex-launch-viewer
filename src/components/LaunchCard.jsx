import { useState } from 'react'

const LaunchCard = ({ launch, onSelect }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const getStatusBadge = (launch) => {
    switch (launch.status) {
      case 'upcoming':
        return <span className="upcoming-badge">Upcoming</span>
      case 'success':
        return <span className="success-badge">Success</span>
      case 'failed':
        return <span className="failed-badge">Failed</span>
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Unknown</span>
    }
  }

  const getMissionImage = (launch) => {
    // Try different image sources in order of preference
    if (launch.links?.patch?.small) {
      return launch.links.patch.small
    }
    if (launch.links?.patch?.large) {
      return launch.links.patch.large
    }
    if (launch.links?.flickr?.small?.[0]) {
      return launch.links.flickr.small[0]
    }
    if (launch.links?.flickr?.original?.[0]) {
      return launch.links.flickr.original[0]
    }
    // Return null to trigger fallback
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const renderImage = () => {
    const imageUrl = getMissionImage(launch)
    
    if (!imageUrl || imageError) {
      return (
        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">🚀</span>
            <p className="text-gray-400 text-sm">Mission Patch</p>
          </div>
        </div>
      )
    }

    return (
      <img 
        src={imageUrl} 
        alt={launch.name || 'SpaceX Launch'}
        className={`w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    )
  }

  return (
    <div 
      className="launch-card cursor-pointer group"
      onClick={() => onSelect(launch)}
    >
      <div className="relative mb-4">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {renderImage()}
        <div className="absolute top-2 right-2">
          {getStatusBadge(launch)}
        </div>
        {launch.timeUntilLaunch && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {launch.timeUntilLaunch}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {launch.name || 'Unnamed Mission'}
        </h3>
        
        <div className="text-gray-400 text-sm space-y-1">
          <p>
            <span className="font-semibold">Date:</span> {launch.formattedDate || formatDate(launch.date_utc)}
          </p>
          {launch.flight_number && (
            <p>
              <span className="font-semibold">Flight:</span> #{launch.flight_number}
            </p>
          )}
          {launch.rocketName && launch.rocketName !== 'Unknown Rocket' && (
            <p>
              <span className="font-semibold">Rocket:</span> {launch.rocketName}
            </p>
          )}
          {launch.launchpadName && launch.launchpadName !== 'Unknown Launchpad' && (
            <p>
              <span className="font-semibold">Launchpad:</span> {launch.launchpadName}
            </p>
          )}
          {launch.payloadInfo && launch.payloadInfo !== 'No payload info' && (
            <p className="text-gray-300">
              <span className="font-semibold">Payload:</span> {launch.payloadInfo}
            </p>
          )}
        </div>
        
        {launch.details && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {launch.details.length > 100 
              ? `${launch.details.substring(0, 100)}...` 
              : launch.details
            }
          </p>
        )}
        
        <div className="pt-2">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default LaunchCard 