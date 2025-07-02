import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "Inbox",
  title = "No data available", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card padding="xl" className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6"
          >
            <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          
          {onAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={onAction}
                icon="Plus"
                size="lg"
                className="mb-6"
              >
                {actionLabel}
              </Button>
            </motion.div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help getting started?{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                View our guide
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Empty