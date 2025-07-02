import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "We're having trouble loading your data. Please try again.", 
  onRetry,
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
            className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6"
          >
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                icon="RefreshCw"
                size="lg"
                className="order-1 sm:order-2"
              >
                Try Again
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              icon="RotateCcw"
              size="lg"
              className="order-2 sm:order-1"
            >
              Refresh Page
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              If the problem persists, please contact support at{' '}
              <a href="mailto:support@primeclub.com" className="text-primary-600 hover:text-primary-700 font-medium">
                support@primeclub.com
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Error