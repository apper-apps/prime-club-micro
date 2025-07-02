import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import LeadCard from '@/components/molecules/LeadCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService, meetingService, salesRepService } from '@/services/api'

const Dashboard = () => {
  const [leads, setLeads] = useState([])
  const [meetings, setMeetings] = useState([])
  const [salesReps, setSalesReps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [leadsData, meetingsData, repsData] = await Promise.all([
        leadService.getAll(),
        meetingService.getAll(),
        salesRepService.getAll()
      ])
      
      setLeads(leadsData)
      setMeetings(meetingsData)
      setSalesReps(repsData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate metrics
  const totalLeads = leads.length
  const activeDeals = leads.filter(lead => !['Closed', 'Lost'].includes(lead.stage)).length
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0)
  const conversionRate = totalLeads > 0 ? ((leads.filter(lead => lead.stage === 'Closed').length / totalLeads) * 100) : 0
  const todaysMeetings = meetings.filter(meeting => {
    const today = new Date().toDateString()
    return new Date(meeting.startTime).toDateString() === today
  })
  
  const recentWins = leads
    .filter(lead => lead.stage === 'Closed')
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
    .slice(0, 5)

  return (
    <div className="p-6 space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={totalLeads.toLocaleString()}
          icon="Users"
          trend="up"
          trendValue="12%"
          color="primary"
          gradient
        />
        <MetricCard
          title="Active Deals"
          value={activeDeals.toLocaleString()}
          subtitle="In pipeline"
          icon="GitBranch"
          color="info"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          icon="DollarSign"
          trend="up"
          trendValue="8%"
          color="success"
          gradient
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          subtitle="This month"
          icon="Target"
          trend={conversionRate > 20 ? "up" : "down"}
          trendValue="2.1%"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Meetings */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="mr-3 h-6 w-6 text-primary-600" />
              Today's Meetings
            </h3>
            <Button variant="secondary" size="sm" icon="Plus">
              Schedule
            </Button>
          </div>
          
          {todaysMeetings.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No meetings today"
              message="You have a clear schedule today. Great time to focus on follow-ups!"
              actionLabel="Schedule Meeting"
            />
          ) : (
            <div className="space-y-4">
              {todaysMeetings.slice(0, 5).map((meeting, index) => (
                <motion.div
                  key={meeting.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600">{meeting.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" icon="Video">
                      Join
                    </Button>
                    <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Wins */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <ApperIcon name="Trophy" className="mr-3 h-6 w-6 text-gold-500" />
              Recent Wins
            </h3>
          </div>
          
          {recentWins.length === 0 ? (
            <Empty
              icon="Trophy"
              title="No recent wins"
              message="Keep pushing! Your next win is just around the corner."
            />
          ) : (
            <div className="space-y-3">
              {recentWins.map((lead, index) => (
                <motion.div
                  key={lead.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-700">
                        ${lead.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(lead.lastActivity).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Mini Pipeline Overview */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="GitBranch" className="mr-3 h-6 w-6 text-primary-600" />
            Pipeline Overview
          </h3>
          <Button variant="secondary" size="sm" icon="ArrowRight">
            View Full Pipeline
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {['Connected', 'Locked', 'Meeting Booked', 'Meeting Done', 'Negotiation', 'Qualified', 'Closed', 'Lost'].map((stage) => {
            const stageLeads = leads.filter(lead => lead.stage === stage)
            const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0)
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stageLeads.length}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {stage}
                </div>
                <div className="text-xs text-gray-500">
                  ${(stageValue / 1000).toFixed(0)}K
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard