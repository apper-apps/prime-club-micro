import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Avatar from '@/components/atoms/Avatar'
import ApperIcon from '@/components/ApperIcon'
import { formatCurrency, getStageColor } from '@/utils/formatters'

const LeadCard = ({ 
  lead, 
  draggable = false, 
  onClick,
  className = '' 
}) => {
  const stageColor = getStageColor(lead.stage)
  const daysInStage = Math.floor((new Date() - new Date(lead.lastActivity)) / (1000 * 60 * 60 * 24))
  
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        padding="md" 
        hover 
        onClick={onClick}
        className={`border-l-4 ${stageColor.border} cursor-pointer`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{lead.name}</h4>
              <p className="text-sm text-gray-600 truncate">{lead.company}</p>
            </div>
            <Badge variant={stageColor.variant} size="sm">
              {lead.stage}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">
              {formatCurrency(lead.value)}
            </span>
            <span className="text-gray-500">
              {daysInStage}d in stage
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar name={lead.assignedTo} size="sm" />
              <span className="text-sm text-gray-600">{lead.assignedTo}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
              {new Date(lead.lastActivity).toLocaleDateString()}
            </div>
          </div>
          
          {lead.nextAction && (
            <div className="flex items-center text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
              <ApperIcon name="Bell" className="h-3 w-3 mr-1" />
              {lead.nextAction}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default LeadCard