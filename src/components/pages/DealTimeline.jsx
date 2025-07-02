import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, addMonths, subMonths } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api'

const DealTimeline = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('timeline') // timeline, kanban, list
  const [selectedQuarter, setSelectedQuarter] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const leadsData = await leadService.getAll()
      setLeads(leadsData)
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

  const timelineData = [
    {
      period: 'Q1 2024 (Jan - Mar)',
      color: 'blue',
      deals: [
        { name: 'Canva Enterprise', value: 185000, stage: 'Negotiation', probability: 85, closeDate: '2024-02-15', contact: 'Sarah Chen' },
        { name: 'Notion Pro Plan', value: 75000, stage: 'Proposal Sent', probability: 70, closeDate: '2024-02-28', contact: 'Mike Ross' },
        { name: 'ClickUp Business', value: 125000, stage: 'Meeting Booked', probability: 60, closeDate: '2024-03-10', contact: 'Jessica Park' }
      ]
    },
    {
      period: 'Q2 2024 (Apr - Jun)',
      color: 'green',
      deals: [
        { name: 'Ahrefs Pro Suite', value: 95000, stage: 'Discovery', probability: 45, closeDate: '2024-04-20', contact: 'David Kim' },
        { name: 'Scribe Enterprise', value: 65000, stage: 'Qualified', probability: 75, closeDate: '2024-05-15', contact: 'Emma Wilson' },
        { name: 'Figma Business', value: 140000, stage: 'Proposal Sent', probability: 80, closeDate: '2024-06-01', contact: 'Alex Chen' }
      ]
    },
    {
      period: 'Q3 2024 (Jul - Sep)',
      color: 'purple',
      deals: [
        { name: 'Slack Enterprise Grid', value: 220000, stage: 'Connected', probability: 35, closeDate: '2024-07-30', contact: 'Ryan Adams' },
        { name: 'Zoom Enterprise', value: 85000, stage: 'Discovery', probability: 50, closeDate: '2024-08-15', contact: 'Lisa Zhang' },
        { name: 'Miro Business', value: 55000, stage: 'Meeting Booked', probability: 65, closeDate: '2024-09-10', contact: 'Tom Johnson' }
      ]
    }
  ]

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-700',
        accent: 'border-blue-500',
        badge: 'primary'
      },
      green: {
        bg: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        accent: 'border-emerald-500',
        badge: 'success'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-700',
        accent: 'border-purple-500',
        badge: 'secondary'
      }
    }
    return colorMap[color] || colorMap.blue
  }

  const getTotalValue = () => {
    return timelineData.reduce((total, quarter) => 
      total + quarter.deals.reduce((sum, deal) => sum + deal.value, 0), 0
    )
  }

  const getWeightedRevenue = () => {
    return timelineData.reduce((total, quarter) => 
      total + quarter.deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0), 0
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
<div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-coral-600 to-primary-800 bg-clip-text text-transparent">
            Deal Timeline
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <ApperIcon name="Target" className="h-4 w-4 mr-1" />
              ${getTotalValue().toLocaleString()} Pipeline
            </span>
            <span className="flex items-center">
              <ApperIcon name="TrendingUp" className="h-4 w-4 mr-1" />
              ${Math.round(getWeightedRevenue()).toLocaleString()} Weighted
            </span>
            <span className="flex items-center">
              <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
              {timelineData.reduce((total, q) => total + q.deals.length, 0)} Active Deals
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {['timeline', 'kanban', 'list'].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="capitalize min-w-[80px]"
              >
                {mode}
              </Button>
            ))}
          </div>
          <Button icon="Plus" className="shadow-lg hover:shadow-xl transition-shadow">
            New Deal
          </Button>
          <Button variant="outline" icon="Download" className="shadow-sm hover:shadow-md transition-shadow">
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pipeline', value: `$${getTotalValue().toLocaleString()}`, icon: 'DollarSign', color: 'blue' },
          { label: 'Weighted Revenue', value: `$${Math.round(getWeightedRevenue()).toLocaleString()}`, icon: 'Target', color: 'green' },
          { label: 'Active Deals', value: timelineData.reduce((total, q) => total + q.deals.length, 0), icon: 'Briefcase', color: 'purple' },
          { label: 'Avg Deal Size', value: `$${Math.round(getTotalValue() / timelineData.reduce((total, q) => total + q.deals.length, 0)).toLocaleString()}`, icon: 'BarChart3', color: 'orange' }
        ].map((stat, index) => {
          const colors = getColorClasses(stat.color)
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg" className="hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} ${colors.border} border`}>
                    <ApperIcon name={stat.icon} className={`h-6 w-6 ${colors.text}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Timeline View */}
      <div className="space-y-8">
        {timelineData.map((quarter, quarterIndex) => {
          const colors = getColorClasses(quarter.color)
          
          return (
            <motion.div
              key={quarter.period}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: quarterIndex * 0.2 }}
            >
              <Card padding="none" className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Quarter Header */}
                <div className={`p-6 bg-gradient-to-r ${colors.bg} ${colors.border} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-1 h-8 bg-gradient-to-b ${colors.accent.replace('border-', 'from-')} to-transparent rounded-full`}></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{quarter.period}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {quarter.deals.length} deals • ${quarter.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} total value
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={colors.badge} size="lg">
                        {Math.round(quarter.deals.reduce((sum, deal) => sum + deal.probability, 0) / quarter.deals.length)}% Avg
                      </Badge>
                      <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                    </div>
                  </div>
                </div>

                {/* Deals Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {quarter.deals.map((deal, dealIndex) => (
                      <motion.div
                        key={deal.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: quarterIndex * 0.2 + dealIndex * 0.1 }}
                        className="group"
                      >
                        <Card 
                          padding="lg" 
                          className="h-full hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group-hover:transform group-hover:scale-[1.02]"
                        >
                          <div className="space-y-4">
                            {/* Deal Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-700 transition-colors">
                                  {deal.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  Contact: {deal.contact}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" icon="ExternalLink" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Value and Probability */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold text-gray-900">
                                  ${deal.value.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">Deal Value</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-semibold ${colors.text}`}>
                                  {deal.probability}%
                                </p>
                                <p className="text-sm text-gray-500">Probability</p>
                              </div>
                            </div>

                            {/* Stage and Close Date */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant={colors.badge} size="sm">
                                  {deal.stage}
                                </Badge>
                                <div className="flex items-center text-sm text-gray-500">
                                  <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                                  {format(new Date(deal.closeDate), 'MMM d, yyyy')}
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Progress</span>
                                  <span className={`font-medium ${colors.text}`}>{deal.probability}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${deal.probability}%` }}
                                    transition={{ delay: quarterIndex * 0.2 + dealIndex * 0.1 + 0.5, duration: 0.8 }}
                                    className={`h-2 rounded-full bg-gradient-to-r ${colors.accent.replace('border-', 'from-')} to-opacity-60`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                              <Button variant="ghost" size="sm" icon="MessageCircle" className="flex-1">
                                Note
                              </Button>
                              <Button variant="ghost" size="sm" icon="Calendar" className="flex-1">
                                Schedule
                              </Button>
                              <Button variant="ghost" size="sm" icon="Edit" className="flex-1">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State (if no data) */}
      {timelineData.length === 0 && (
        <Empty
          icon="Timeline"
          title="No deal timeline data"
          message="Start by adding deals to see your timeline roadmap."
          actionLabel="Add First Deal"
        />
      )}
    </div>
  )
}

export default DealTimeline