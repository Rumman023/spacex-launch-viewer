import { useState } from 'react'

const LaunchDetail = ({ launch, onBack }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getStatusBadge = (launch) => {
    switch (launch.status) {
      case 'upcoming':
        return <span className="upcoming-badge text-sm px-3 py-1">Upcoming</span>
      case 'success':
        return <span className="success-badge text-sm px-3 py-1">Success</span>
      case 'failed':
        return <span className="failed-badge text-sm px-3 py-1">Failed</span>
      default:
        return <span className="bg-gray-500 text-white text-sm px-3 py-1 rounded-full">Unknown</span>
    }
  }

  const getMissionImage = (launch) => {
    // Try different image sources in order of preference
    if (launch.links?.patch?.large) {
      return launch.links.patch.large
    }
    if (launch.links?.patch?.small) {
      return launch.links.patch.small
    }
    if (launch.links?.flickr?.original?.[0]) {
      return launch.links.flickr.original[0]
    }
    if (launch.links?.flickr?.small?.[0]) {
      return launch.links.flickr.small[0]
    }
    // Return null to trigger fallback
    return null
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
        <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🚀</span>
            <p className="text-gray-400 text-lg">Mission Patch</p>
            <p className="text-gray-500 text-sm mt-2">Image not available</p>
          </div>
        </div>
      )
    }

    return (
      <img
        src={imageUrl}
        alt={launch.name || 'SpaceX Launch'}
        className={`w-full h-96 object-cover rounded-lg ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <span className="mr-2">←</span>
        Back to Launches
      </button>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Image */}
          <div className="relative">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            {renderImage()}
          </div>

          {/* Mission Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{launch.name || 'Unnamed Mission'}</h1>
                {getStatusBadge(launch)}
              </div>
              
              {launch.details && (
                <p className="text-gray-300 leading-relaxed">
                  {launch.details}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-semibold mb-1">Launch Date</h3>
                  <p className="text-white">{formatDate(launch.date_utc)}</p>
                </div>
                
                {launch.flight_number && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm font-semibold mb-1">Flight Number</h3>
                    <p className="text-white">#{launch.flight_number}</p>
                  </div>
                )}
              </div>

              {launch.rocketName && launch.rocketName !== 'Unknown Rocket' && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-semibold mb-1">Rocket</h3>
                  <p className="text-white">{launch.rocketName}</p>
                  {launch.rocket?.type && (
                    <p className="text-gray-400 text-xs mt-1">Type: {launch.rocket.type}</p>
                  )}
                </div>
              )}

              {launch.launchpadName && launch.launchpadName !== 'Unknown Launchpad' && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-semibold mb-1">Launch Site</h3>
                  <p className="text-white">{launch.launchpadName}</p>
                  {launch.launchpad?.full_name && (
                    <p className="text-gray-400 text-xs mt-1">{launch.launchpad.full_name}</p>
                  )}
                  {launch.launchpad?.locality && launch.launchpad?.region && (
                    <p className="text-gray-400 text-xs">{launch.launchpad.locality}, {launch.launchpad.region}</p>
                  )}
                </div>
              )}

              {launch.payloadInfo && launch.payloadInfo !== 'No payload info' && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-semibold mb-1">Payload</h3>
                  <p className="text-white">{launch.payloadInfo}</p>
                  {launch.payloads?.map((payload, index) => (
                    <div key={index} className="mt-2 text-xs text-gray-400">
                      {payload.mass_kg && <span>Mass: {payload.mass_kg} kg</span>}
                      {payload.type && <span className="ml-2">Type: {payload.type}</span>}
                    </div>
                  ))}
                </div>
              )}

              {launch.timeUntilLaunch && (
                <div className="bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-blue-200 text-sm font-semibold mb-1">Time Until Launch</h3>
                  <p className="text-white text-lg font-bold">{launch.timeUntilLaunch}</p>
                </div>
              )}
            </div>

            {/* Links */}
            {launch.links && (
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-white font-semibold mb-3">Mission Links</h3>
                <div className="flex flex-wrap gap-3">
                  {launch.links.webcast && (
                    <a
                      href={launch.links.webcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Watch Webcast
                    </a>
                  )}
                  {launch.links.article && (
                    <a
                      href={launch.links.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Read Article
                    </a>
                  )}
                  {launch.links.wikipedia && (
                    <a
                      href={launch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Wikipedia
                    </a>
                  )}
                  {launch.rocket?.wikipedia && (
                    <a
                      href={launch.rocket.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Rocket Info
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaunchDetail 