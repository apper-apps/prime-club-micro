import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { meetingService, leadService } from '@/services/api'

const Calendar = () => {
  const [meetings, setMeetings] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date())

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [meetingsData, leadsData] = await Promise.all([
        meetingService.getAll(),
        leadService.getAll()
      ])
      setMeetings(meetingsData)
      setLeads(leadsData)
    } catch (err) {
      setError('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting =>
      isSameDay(new Date(meeting.startTime), date)
    )
  }

  const getLeadForMeeting = (meeting) => {
    return leads.find(lead => lead.Id === meeting.leadId)
  }

  const todaysMeetings = getMeetingsForDate(selectedDate)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            {format(currentDate, 'MMMM yyyy')} • {meetings.length} meetings scheduled
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView(viewType)}
                className="capitalize"
              >
                {viewType}
              </Button>
            ))}
          </div>
          <Button icon="Plus">
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <Card padding="lg" className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="mr-3 h-6 w-6 text-primary-600" />
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="ChevronLeft"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="ChevronRight"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              />
            </div>
          </div>

          {/* Month View */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}
            
            {monthDays.map((day) => {
              const dayMeetings = getMeetingsForDate(day)
              const isSelected = isSameDay(day, selectedDate)
              const isCurrentDay = isToday(day)
              
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-colors
                    ${isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'}
                    ${isCurrentDay ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}
                    ${isSelected ? 'text-primary-700' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map((meeting) => {
                      const lead = getLeadForMeeting(meeting)
                      return (
                        <div
                          key={meeting.Id}
                          className="text-xs p-1 bg-primary-100 text-primary-700 rounded truncate"
                        >
                          {format(new Date(meeting.startTime), 'HH:mm')} {lead?.name || meeting.title}
                        </div>
                      )
                    })}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayMeetings.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>

        {/* Selected Date Details */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {format(selectedDate, 'EEEE, MMM d')}
            </h3>
            {isToday(selectedDate) && (
              <Badge variant="primary" size="sm">Today</Badge>
            )}
          </div>

          {todaysMeetings.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No meetings"
              message="No meetings scheduled for this day."
              actionLabel="Schedule Meeting"
            />
          ) : (
            <div className="space-y-4">
              {todaysMeetings.map((meeting, index) => {
                const lead = getLeadForMeeting(meeting)
                return (
                  <motion.div
                    key={meeting.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {meeting.title}
                        </h4>
                        {lead && (
                          <p className="text-sm text-gray-600">
                            {lead.name} • {lead.company}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={lead?.stage === 'Closed' ? 'success' : 'primary'} 
                        size="sm"
                      >
                        {lead?.stage || 'Meeting'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                        {format(new Date(meeting.startTime), 'HH:mm')} - 
                        {format(new Date(meeting.endTime), 'HH:mm')}
                      </div>
                      {meeting.location && (
                        <div className="flex items-center">
                          <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                          {meeting.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button variant="ghost" size="sm" icon="Video">
                        Join
                      </Button>
                      <Button variant="ghost" size="sm" icon="Edit">
                        Edit
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Calendar Roadmap */}
      <Card padding="lg">
        <div className="flex items-center mb-6">
          <ApperIcon name="Map" className="mr-3 h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Deal Timeline Roadmap</h2>
        </div>
        
        <div className="space-y-6">
          {/* January to February */}
          <div className="border-l-4 border-primary-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">January - February 2024</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Canva Enterprise', value: 85000, stage: 'Negotiation' },
                { name: 'Notion Pro Plan', value: 45000, stage: 'Meeting Done' },
                { name: 'ClickUp Business', value: 32000, stage: 'Qualified' }
              ].map((deal, index) => (
                <motion.div
                  key={deal.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200"
                >
                  <h4 className="font-semibold text-gray-900">{deal.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary-700 font-medium">
                      ${deal.value.toLocaleString()}
                    </span>
                    <Badge variant="primary" size="sm">{deal.stage}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* February to April */}
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">February - April 2024</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'ClickUp Enterprise', value: 125000, stage: 'Negotiation' },
                { name: 'Ahrefs Pro', value: 78000, stage: 'Meeting Booked' },
                { name: 'Scribe Business', value: 25000, stage: 'Connected' }
              ].map((deal, index) => (
                <motion.div
                  key={deal.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
                >
                  <h4 className="font-semibold text-gray-900">{deal.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-700 font-medium">
                      ${deal.value.toLocaleString()}
                    </span>
                    <Badge variant="success" size="sm">{deal.stage}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Calendar