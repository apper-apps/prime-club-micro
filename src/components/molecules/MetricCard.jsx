import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  gradient = false,
  className = '' 
}) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-gold-600 bg-gold-50',
    danger: 'text-red-600 bg-red-50',
    info: 'text-blue-600 bg-blue-50'
  }
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }
  
  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  }
  
  return (
    <Card hover className={`${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            {gradient ? (
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {value}
              </span>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{value}</span>
            )}
            {trend && trendValue && (
              <div className={`flex items-center text-sm font-medium ${trendColors[trend]}`}>
                <ApperIcon name={trendIcons[trend]} className="h-4 w-4 mr-1" />
                {trendValue}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <motion.div 
            className={`p-3 rounded-xl ${colors[color]}`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name={icon} className="h-6 w-6" />
          </motion.div>
        )}
      </div>
    </Card>
  )
}

export default MetricCard