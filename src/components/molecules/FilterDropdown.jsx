import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(option => option.value === value)
  
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        icon="Filter"
        className="min-w-[150px] justify-between"
      >
        {selectedOption?.label || label}
        <ApperIcon name="ChevronDown" className="ml-2 h-4 w-4" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-premium border border-gray-200 z-50"
          >
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                    ${value === option.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default FilterDropdown