import React from 'react'
import { motion } from 'framer-motion'
import LeadCard from '@/components/molecules/LeadCard'
import { getStageColor } from '@/utils/formatters'

const PipelineColumn = ({ 
  stage, 
  leads, 
  onLeadClick, 
  onDrop,
  className = '' 
}) => {
  const stageColor = getStageColor(stage)
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0)
  
  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    if (onDrop) {
      onDrop(leadId, stage)
    }
  }
  
  return (
    <div 
      className={`bg-gray-50 rounded-xl p-4 min-h-[600px] ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <div className={`w-3 h-3 rounded-full ${stageColor.bg} mr-2`} />
            {stage}
          </h3>
          <span className="text-sm font-medium text-gray-500">
            {leads.length}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          ${totalValue.toLocaleString()}
        </p>
      </div>
      
      <div className="space-y-3">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', lead.Id.toString())
            }}
          >
            <LeadCard 
              lead={lead} 
              onClick={() => onLeadClick?.(lead)}
              draggable
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PipelineColumn