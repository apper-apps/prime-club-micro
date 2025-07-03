import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Draggable from 'react-draggable'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { dealService } from '@/services/api'

const DealTimeline = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const priorityColors = {
    high: 'bg-gradient-to-r from-coral-500 to-coral-600',
    medium: 'bg-gradient-to-r from-gold-500 to-gold-600',
    low: 'bg-gradient-to-r from-success-500 to-success-600'
  }

  useEffect(() => {
    loadDeals()
  }, [])

  async function loadDeals() {
    try {
      setLoading(true)
      setError(null)
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStop = async (dealId, data, type) => {
    if (!draggedDeal) return

    const cellWidth = 100 // Approximate width of each month cell
    const monthsOffset = Math.round(data.x / cellWidth)
    
    const deal = deals.find(d => d.Id === dealId)
    if (!deal) return

    let newStartMonth = deal.startMonth
    let newEndMonth = deal.endMonth

    if (type === 'start') {
      newStartMonth = Math.max(0, Math.min(11, deal.startMonth + monthsOffset))
      if (newStartMonth >= deal.endMonth) {
        newStartMonth = deal.endMonth - 1
      }
    } else if (type === 'end') {
      newEndMonth = Math.max(0, Math.min(11, deal.endMonth + monthsOffset))
      if (newEndMonth <= deal.startMonth) {
        newEndMonth = deal.startMonth + 1
      }
    } else {
      // Moving entire deal
      const duration = deal.endMonth - deal.startMonth
      newStartMonth = Math.max(0, Math.min(11 - duration, deal.startMonth + monthsOffset))
      newEndMonth = newStartMonth + duration
    }

    try {
      const updatedDeal = await dealService.updateDealTimeline(dealId, newStartMonth, newEndMonth)
      setDeals(prevDeals => 
        prevDeals.map(d => d.Id === dealId ? updatedDeal : d)
      )
      toast.success('Deal timeline updated')
    } catch (err) {
      toast.error('Failed to update deal timeline')
    }

    setDraggedDeal(null)
  }

  const renderDealBar = (deal, rowIndex) => {
    const width = (deal.endMonth - deal.startMonth + 1) * 100
    const leftOffset = deal.startMonth * 100

    return (
      <motion.div
        key={deal.Id}
        className="absolute flex items-center"
        style={{
          left: `${leftOffset}px`,
          width: `${width}px`,
          top: `${rowIndex * 80 + 10}px`,
          height: '60px'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Draggable
          axis="x"
          bounds="parent"
          onStart={() => setDraggedDeal(deal.Id)}
          onStop={(e, data) => handleDragStop(deal.Id, data, 'move')}
        >
          <div className={`
            relative w-full h-full rounded-lg cursor-move shadow-card hover:shadow-card-hover transition-all duration-200
            ${priorityColors[deal.priority]} text-white flex items-center justify-between px-3
          `}>
            {/* Start handle */}
            <Draggable
              axis="x"
              bounds="parent"
              onStart={(e) => {
                e.stopPropagation()
                setDraggedDeal(deal.Id)
              }}
              onStop={(e, data) => {
                e.stopPropagation()
                handleDragStop(deal.Id, data, 'start')
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-20 cursor-ew-resize hover:bg-opacity-40 transition-colors rounded-l-lg" />
            </Draggable>

            {/* Deal content */}
            <div className="flex-1 px-2 min-w-0">
              <div className="font-semibold text-sm truncate">{deal.name}</div>
              <div className="text-xs opacity-90 truncate">{deal.company}</div>
            </div>

            {/* End handle */}
            <Draggable
              axis="x"
              bounds="parent"
              onStart={(e) => {
                e.stopPropagation()
                setDraggedDeal(deal.Id)
              }}
              onStop={(e, data) => {
                e.stopPropagation()
                handleDragStop(deal.Id, data, 'end')
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-20 cursor-ew-resize hover:bg-opacity-40 transition-colors rounded-r-lg" />
            </Draggable>
          </div>
        </Draggable>
      </motion.div>
    )
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDeals} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Timeline</h1>
          <p className="text-gray-600 mt-1">Visual timeline of deals across the year</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-coral-500"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-gold-500"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-success-500"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Month headers */}
              <div className="grid grid-cols-12 gap-0 mb-4">
                {months.map((month, index) => (
                  <div key={month} className="text-center p-3 bg-gray-50 border-r last:border-r-0">
                    <div className="font-semibold text-gray-900">{month}</div>
                    <div className="text-xs text-gray-500 mt-1">2024</div>
                  </div>
                ))}
              </div>

              {/* Timeline grid */}
              <div className="relative" style={{ height: '560px' }}>
                {/* Grid lines */}
                <div className="grid grid-cols-12 gap-0 h-full">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="border-r last:border-r-0 border-gray-200 h-full" />
                  ))}
                </div>

                {/* Row separators */}
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute left-0 right-0 border-b border-gray-100"
                    style={{ top: `${index * 80}px` }}
                  />
                ))}

                {/* Deal bars */}
                {deals.slice(0, 7).map((deal, index) => renderDealBar(deal, index))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Info" size={16} />
              <span>Drag deal bars to adjust timeline. Use handles on edges to resize duration.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Deal details cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {deals.map((deal) => (
          <Card key={deal.Id} hover className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium text-white
                ${priorityColors[deal.priority]}
              `}>
                {deal.priority.toUpperCase()}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ${(deal.value / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-1 truncate">{deal.name}</h3>
            <p className="text-gray-600 text-sm mb-3 truncate">{deal.company}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{months[deal.startMonth]} - {months[deal.endMonth]}</span>
              <span className="flex items-center space-x-1">
                <ApperIcon name="User" size={14} />
                <span>{deal.assignedTo}</span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DealTimeline