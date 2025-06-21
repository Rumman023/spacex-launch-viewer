import { useState, useEffect } from 'react'
import LaunchList from './components/LaunchList'
import LaunchDetail from './components/LaunchDetail'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [launches, setLaunches] = useState([])
  const [selectedLaunch, setSelectedLaunch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchLaunches()
  }, [])

  const fetchLaunches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the latest SpaceX API v4 with enhanced query
      const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {},
          options: {
            limit: 30,
            sort: {
              date_utc: 'desc'
            },
            populate: [
              {
                path: 'rocket',
                select: {
                  name: 1,
                  type: 1,
                  company: 1,
                  country: 1,
                  wikipedia: 1
                }
              },
              {
                path: 'launchpad',
                select: {
                  name: 1,
                  full_name: 1,
                  locality: 1,
                  region: 1,
                  country: 1
                }
              },
              {
                path: 'payloads',
                select: {
                  name: 1,
                  type: 1,
                  mass_kg: 1,
                  customers: 1
                }
              }
            ]
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Process and enhance the launch data
      const enhancedLaunches = data.docs.map(launch => ({
        ...launch,
        // Add computed fields for better display
        formattedDate: new Date(launch.date_utc).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timeUntilLaunch: launch.upcoming ? getTimeUntilLaunch(launch.date_utc) : null,
        status: getLaunchStatus(launch),
        rocketName: launch.rocket?.name || 'Unknown Rocket',
        launchpadName: launch.launchpad?.name || 'Unknown Launchpad',
        payloadInfo: launch.payloads?.map(p => p.name).join(', ') || 'No payload info'
      }))

      setLaunches(enhancedLaunches)
      setLastUpdated(new Date().toLocaleTimeString())
      
    } catch (err) {
      console.error('Error fetching launches:', err)
      setError(err.message || 'Failed to fetch launch data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get time until launch for upcoming missions
  const getTimeUntilLaunch = (launchDate) => {
    const now = new Date()
    const launch = new Date(launchDate)
    const diff = launch - now
    
    if (diff <= 0) return 'Launching soon!'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Helper function to determine launch status
  const getLaunchStatus = (launch) => {
    if (launch.upcoming) return 'upcoming'
    if (launch.success === true) return 'success'
    if (launch.success === false) return 'failed'
    return 'unknown'
  }

  const handleLaunchSelect = (launch) => {
    setSelectedLaunch(launch)
  }

  const handleBackToList = () => {
    setSelectedLaunch(null)
  }

  const handleRefresh = () => {
    fetchLaunches()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Launches</h2>
          <p className="text-gray-300 mb-4 max-w-md">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header lastUpdated={lastUpdated} onRefresh={handleRefresh} />
      <main className="container mx-auto px-4 py-8">
        {selectedLaunch ? (
          <LaunchDetail 
            launch={selectedLaunch} 
            onBack={handleBackToList}
          />
        ) : (
          <LaunchList 
            launches={launches} 
            onLaunchSelect={handleLaunchSelect}
          />
        )}
      </main>
    </div>
  )
}

export default App
