import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api'

const DealTimeline = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      await leadService.getAll() // Keep for consistency but not using the data
    } catch (err) {
      setError('Failed to load deal timeline data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  // Sample deal data with month ranges
  const deals = [
    { 
      name: 'Canva Enterprise Deal',
      startMonth: 0, // January (0-indexed)
      endMonth: 2,   // March
      color: 'bg-blue-500'
    },
    { 
      name: 'Notion Pro Plan Agreement',
      startMonth: 1, // February
      endMonth: 4,   // May
      color: 'bg-green-500'
    },
    { 
      name: 'ClickUp Business Contract',
      startMonth: 2, // March
      endMonth: 5,   // June
      color: 'bg-purple-500'
    },
    { 
      name: 'Ahrefs Pro Suite Negotiation',
      startMonth: 3, // April
      endMonth: 7,   // August
      color: 'bg-orange-500'
    },
    { 
      name: 'Scribe Enterprise Deal',
      startMonth: 4, // May
      endMonth: 6,   // July
      color: 'bg-pink-500'
    },
    { 
      name: 'Figma Business License',
      startMonth: 5, // June
      endMonth: 8,   // September
      color: 'bg-indigo-500'
    },
    { 
      name: 'Slack Enterprise Grid',
      startMonth: 6, // July
      endMonth: 11,  // December
      color: 'bg-red-500'
    },
    { 
      name: 'Zoom Enterprise Package',
      startMonth: 7, // August
      endMonth: 10,  // November
      color: 'bg-teal-500'
    }
  ]

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const getDealWidth = (startMonth, endMonth) => {
    const monthSpan = endMonth - startMonth + 1
    return `${(monthSpan / 12) * 100}%`
  }

  const getDealPosition = (startMonth) => {
    return `${(startMonth / 12) * 100}%`
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Simple Header */}
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-coral-600 to-primary-800 bg-clip-text text-transparent">
          Deal Timeline
        </h1>
      </div>

      {/* Calendar View */}
      <Card padding="lg" className="overflow-hidden">
        {/* Month Headers */}
        <div className="grid grid-cols-12 gap-0 mb-8">
          {months.map((month, index) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center py-3 border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm font-semibold text-gray-700">{month}</div>
              <div className="text-xs text-gray-500 mt-1">2024</div>
            </motion.div>
          ))}
        </div>

        {/* Deal Timeline Bars */}
        <div className="space-y-4 relative">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-12 bg-gray-50 rounded-lg overflow-hidden"
            >
              {/* Month Grid Background */}
              <div className="absolute inset-0 grid grid-cols-12">
                {months.map((_, monthIndex) => (
                  <div 
                    key={monthIndex} 
                    className="border-r border-gray-200 last:border-r-0"
                  />
                ))}
              </div>

              {/* Deal Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getDealWidth(deal.startMonth, deal.endMonth) }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                className={`absolute top-1 bottom-1 ${deal.color} rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm`}
                style={{
                  left: getDealPosition(deal.startMonth),
                }}
              >
                <div className="flex items-center h-full px-3">
                  <span className="text-white text-sm font-medium truncate">
                    {deal.name}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Responsive Version */}
        <div className="md:hidden mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal List</h3>
          {deals.map((deal, index) => (
            <motion.div
              key={`mobile-${deal.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-4 h-4 rounded ${deal.color}`}></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{deal.name}</div>
                <div className="text-sm text-gray-500">
                  {months[deal.startMonth]} - {months[deal.endMonth]} 2024
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {deals.length === 0 && (
        <Empty
          icon="Calendar"
          title="No deals in timeline"
          message="Start by adding deals to see your calendar view."
          actionLabel="Add First Deal"
        />
      )}
    </div>
  )
}

export default DealTimeline